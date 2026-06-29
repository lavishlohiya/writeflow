const postRepository = require("../repositories/post.repository");
const { post, search } = require("../routes/post.route");

async function createPost(title, content, authorId) {
    
    return postRepository.createPost(title, content, authorId);
};

async function getPosts(page, limit, search) {
    return postRepository.getPosts(page, limit, search);
}

async function getPostById(id) {
    return postRepository.getPostById(id);
}

async function updatePost(postId, content, userId, userRole) {
    const post = await postRepository.getPostById(postId);

    if (!post) {
        throw new Error("Post does not exists");
    }

    if (post.author_id != userId && userRole != "ADMIN") {
        throw new Error("Forbidden access");
    }

    return postRepository.updatePost(postId, content);
}

async function deletePost(postId, userId, userRole) {

    const post = await postRepository.getPostById(postId);

    if (!post) {
      throw new Error("Post does not exists");
    }

    if (post.author_id != userId && userRole != "ADMIN") {
        throw new Error("Unauthorized access");
    }

    return postRepository.deletePost(postId,);
}

async function createComment(content, postId, userId) {
    const post = await postRepository.getPostById(postId);

    if (!post) {
        throw new Error("Post does not exists");
    }

    return postRepository.createComment(content, postId, userId);

}

async function getComments(postId) {
    const post = await postRepository.getPostById(postId);

    if (!post) {
        throw new Error("Post does not exists");
    }

    return postRepository.getComments(postId);
}

async function updateComment(userId, userRole, commentId, content) {
    const comment = await postRepository.getCommentById(commentId);

    if (!comment) {
        throw new Error("Comment does not exists");
    }

    if (comment.user_id != userId && userRole != "ADMIN") {
        throw new Error("You dont have the access");
    }

    return postRepository.updateComment(commentId, content);
}

async function deleteComment(userId, userRole, commentId) {
    const comment = await postRepository.getCommentById(commentId);

    if (!comment) {
        throw new Error("Comment does not exists");
    }

    if (comment.user_id != userId && userRole != "ADMIN") {
        throw new Error("You dont have the access");
    }

    return postRepository.deleteComment(commentId);
}

module.exports = {
    createPost, getPosts, getPostById,
    updatePost, deletePost, createComment,
    getComments, updateComment, deleteComment
 };
