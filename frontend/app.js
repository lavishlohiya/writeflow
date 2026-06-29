const authPanel = document.getElementById("authPanel");
const appView = document.getElementById("appView");
const authMessage = document.getElementById("authMessage");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const createPostForm = document.getElementById("createPostForm");
const postsList = document.getElementById("postsList");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageInfo = document.getElementById("pageInfo");
const detailEmpty = document.getElementById("detailEmpty");
const postDetail = document.getElementById("postDetail");
const detailTitle = document.getElementById("detailTitle");
const detailMeta = document.getElementById("detailMeta");
const detailContent = document.getElementById("detailContent");
const detailActions = document.getElementById("detailActions");
const toggleEditBtn = document.getElementById("toggleEditBtn");
const editPanel = document.getElementById("editPanel");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editPostForm = document.getElementById("editPostForm");
const deletePostBtn = document.getElementById("deletePostBtn");
const commentsList = document.getElementById("commentsList");
const commentsCount = document.getElementById("commentsCount");
const commentForm = document.getElementById("commentForm");
const logoutBtn = document.getElementById("logoutBtn");
const refreshFeed = document.getElementById("refreshFeed");
const searchInput = document.getElementById("searchInput");
const userLine = document.getElementById("userLine");

const state = {
  posts: [],
  activePostId: null,
  activePost: null,
  comments: [],
  search: "",
  currentUser: null,
  isEditing: false,
  currentPage: 1,
  pageSize: 5,
  hasMore: false,
};

function setMessage(text, tone = "neutral") {
  authMessage.textContent = text;
  authMessage.style.color =
    tone === "error" ? "var(--danger)" : tone === "success" ? "var(--accent)" : "var(--muted)";
}

function showAuth() {
  authPanel.classList.remove("hidden");
  appView.classList.add("hidden");
}

function showApp() {
  authPanel.classList.add("hidden");
  appView.classList.remove("hidden");
}

function switchAuth(tab) {
  const loginActive = tab === "login";
  loginTab.classList.toggle("active", loginActive);
  registerTab.classList.toggle("active", !loginActive);
  loginForm.classList.toggle("hidden", !loginActive);
  registerForm.classList.toggle("hidden", loginActive);
  setMessage("");
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMeta(post) {
  const bits = [];
  if (post.id != null) bits.push(`Post #${post.id}`);
  if (post.author_id != null) bits.push(`Author ${post.author_id}`);
  return bits.join(" | ");
}

function canManagePost(post = state.activePost) {
  if (!state.currentUser || !post) {
    return false;
  }

  return (
    state.currentUser.role === "ADMIN" ||
    String(state.currentUser.id) === String(post.author_id)
  );
}

function setEditing(nextValue) {
  state.isEditing = nextValue;
  if (editPanel) {
    editPanel.classList.toggle("hidden", !nextValue);
  }
  if (detailContent) {
    detailContent.classList.toggle("hidden", nextValue);
  }
  if (toggleEditBtn) {
    toggleEditBtn.textContent = nextValue ? "Close" : "Edit";
  }
}

function summarize(text = "") {
  const cleaned = text.trim().replace(/\s+/g, " ");
  return cleaned.length > 140 ? `${cleaned.slice(0, 140)}...` : cleaned;
}

async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(payload?.message || payload || "Request failed");
    error.status = response.status;
    throw error;
  }

  return payload;
}

function renderPosts() {
  if (!state.posts.length) {
    postsList.innerHTML = '<div class="empty-state">No posts yet. Be the first to publish one.</div>';
    return;
  }

  postsList.innerHTML = state.posts
    .map(
      (post) => `
        <article class="post-card" data-id="${post.id}">
          <h3>${escapeHtml(post.title || "Untitled")}</h3>
          <p>${escapeHtml(summarize(post.content || ""))}</p>
          <div class="post-meta">${escapeHtml(formatMeta(post))}</div>
        </article>
      `,
    )
    .join("");
}

function renderPagination() {
  pageInfo.textContent = `Page ${state.currentPage}`;
  prevPageBtn.disabled = state.currentPage <= 1;
  nextPageBtn.disabled = !state.hasMore;
}

function renderComments() {
  commentsCount.textContent = String(state.comments.length);

  if (!state.comments.length) {
    commentsList.innerHTML = '<div class="empty-state">No comments yet.</div>';
    return;
  }

  commentsList.innerHTML = state.comments
    .map(
      (comment) => `
        <article class="comment">
          <div>${escapeHtml(comment.content)}</div>
          <small>Comment #${comment.id} | User ${comment.user_id}</small>
        </article>
      `,
    )
    .join("");
}

function renderDetail() {
  if (!state.activePost) {
    detailEmpty.classList.remove("hidden");
    postDetail.classList.add("hidden");
    setEditing(false);
    return;
  }

  detailEmpty.classList.add("hidden");
  postDetail.classList.remove("hidden");
  detailTitle.textContent = state.activePost.title || "Untitled";
  detailMeta.textContent = formatMeta(state.activePost);
  detailContent.textContent = state.activePost.content || "";

  const canEdit = canManagePost(state.activePost);

  detailActions.classList.toggle("hidden", !canEdit);
  editPanel.classList.toggle("hidden", !(canEdit && state.isEditing));

  detailContent.classList.toggle("hidden", canEdit && state.isEditing);

  if (canEdit && state.isEditing) {
    editPostForm.elements.content.value = state.activePost.content || "";
  }

  if (!canEdit) {
    setEditing(false);
  }
}

async function loadFeed() {
  const page = state.currentPage;
  const params = new URLSearchParams({
    page: String(page),
    limit: String(state.pageSize),
  });

  if (state.search) {
    params.set("search", state.search);
  }

  try {
    const posts = await api(`/post?${params.toString()}`);
    state.posts = Array.isArray(posts) ? posts : [];

    if (!state.posts.length && state.currentPage > 1) {
      state.currentPage -= 1;
      return loadFeed();
    }

    state.hasMore = state.posts.length === state.pageSize;
    renderPosts();
    renderPagination();
    return true;
  } catch (error) {
    if (error.status === 401) {
      showAuth();
      setMessage("Please log in to view posts.", "error");
      return false;
    }

    postsList.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
    state.hasMore = false;
    renderPagination();
    return false;
  }
}

async function loadCurrentUser() {
  try {
    const user = await api("/auth/me");
    state.currentUser = user;
    userLine.textContent = `${user.username || "Member"}${user.role === "ADMIN" ? " (Admin)" : ""} ready.`;
    return true;
  } catch (error) {
    state.currentUser = null;
    if (error.status === 401) {
      return false;
    }
    throw error;
  }
}

async function loadPost(postId) {
  state.activePostId = postId;
  try {
    const [post, comments] = await Promise.all([
      api(`/post/${postId}`),
      api(`/post/comment/${postId}`),
    ]);

    state.activePost = post;
    state.comments = Array.isArray(comments) ? comments : [];
    setEditing(false);
    renderDetail();
    renderComments();
  } catch (error) {
    if (error.status === 401) {
      showAuth();
      setMessage("Session expired. Log in again.", "error");
      return;
    }

    detailEmpty.textContent = error.message;
    detailEmpty.classList.remove("hidden");
    postDetail.classList.add("hidden");
  }
}

toggleEditBtn.addEventListener("click", () => {
  if (!canManagePost()) return;
  setEditing(!state.isEditing);
  if (state.isEditing) {
    editPostForm.elements.content.value = state.activePost?.content || "";
  }
});

cancelEditBtn.addEventListener("click", () => {
  setEditing(false);
});

loginTab.addEventListener("click", () => switchAuth("login"));
registerTab.addEventListener("click", () => switchAuth("register"));

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);

  try {
    await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    setMessage("Logged in successfully.", "success");
    await loadCurrentUser();
    state.currentPage = 1;
    showApp();
    await loadFeed();
  } catch (error) {
    setMessage(error.message, "error");
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);

  try {
    await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    setMessage("Account created. Switch to login and continue.", "success");
    switchAuth("login");
    registerForm.reset();
  } catch (error) {
    setMessage(error.message, "error");
  }
});

createPostForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(createPostForm);

  try {
    await api("/post/create", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        content: formData.get("content"),
      }),
    });

    createPostForm.reset();
    state.currentPage = 1;
    await loadFeed();
  } catch (error) {
    if (error.status === 401) {
      showAuth();
      setMessage("Please log in to create posts.", "error");
      return;
    }

    alert(error.message);
  }
});

postsList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-id]");
  if (!card) return;
  loadPost(card.dataset.id);
});

editPostForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.activePostId) return;

  const formData = new FormData(editPostForm);

  try {
    await api(`/post/${state.activePostId}`, {
      method: "PATCH",
      body: JSON.stringify({
        content: formData.get("content"),
      }),
    });

    setEditing(false);
    await loadPost(state.activePostId);
    await loadFeed();
  } catch (error) {
    alert(error.message);
  }
});

deletePostBtn.addEventListener("click", async () => {
  if (!state.activePostId) return;
  if (!confirm("Delete this post?")) return;

  try {
    await api(`/post/${state.activePostId}`, {
      method: "DELETE",
    });

    state.activePost = null;
    state.activePostId = null;
    state.comments = [];
    if (state.currentPage > 1) {
      state.currentPage -= 1;
    }
    renderDetail();
    renderComments();
    await loadFeed();
  } catch (error) {
    alert(error.message);
  }
});

commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.activePostId) return;

  const formData = new FormData(commentForm);

  try {
    await api(`/post/comment/${state.activePostId}`, {
      method: "POST",
      body: JSON.stringify({
        content: formData.get("content"),
      }),
    });

    commentForm.reset();
    await loadPost(state.activePostId);
  } catch (error) {
    alert(error.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await api("/auth/logout", { method: "POST" });
  } catch (error) {
    console.error(error);
  }

  state.activePost = null;
  state.activePostId = null;
  state.comments = [];
  state.posts = [];
  state.currentUser = null;
  setEditing(false);
  state.currentPage = 1;
  state.hasMore = false;
  renderPosts();
  renderDetail();
  renderComments();
  showAuth();
  setMessage("You are signed out.", "neutral");
});

refreshFeed.addEventListener("click", loadFeed);

prevPageBtn.addEventListener("click", async () => {
  if (state.currentPage <= 1) return;
  state.currentPage -= 1;
  await loadFeed();
});

nextPageBtn.addEventListener("click", async () => {
  if (!state.hasMore) return;
  state.currentPage += 1;
  await loadFeed();
});

let searchTimer;
searchInput.addEventListener("input", () => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    state.search = searchInput.value.trim();
    state.currentPage = 1;
    loadFeed();
  }, 250);
});

async function bootstrap() {
  showAuth();
  switchAuth("login");

  try {
    const authed = await loadCurrentUser();
    if (!authed) {
      showAuth();
      return;
    }

    const ready = await loadFeed();
    if (ready) {
      showApp();
    }
  } catch (error) {
    showAuth();
  }
}

bootstrap();
