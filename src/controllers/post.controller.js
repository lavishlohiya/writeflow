const postService = require("../services/post.service");

async function createPost(req, res) {
    try {
        const { title, content } = req.body;

        const post = await postService.createPost(title, content, req.user.id);

        return res.status(201).json(post);

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: err.message || "Something went wrong"
        })
    }
};

async function getPosts(req, res) {
    try {

        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const search = req.query.search || null;

        const posts = await postService.getPosts(page, limit, search);

        return res.status(200).json(posts);

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message || "Something went wrong"
        })
    }
}

async function getPostById(req, res) {
    try {
        const post = await postService.getPostById(req.params.id);

        return res.status(200).json(post);

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message || "Something went wrong"
        })
    }
};

async function updatePost(req, res) {
    try {
        
        const { content } = req.body;
        const postId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const post = await postService.updatePost(postId, content, userId, userRole);

        return res.status(200).json(post);

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: err.message || "Something went wrong"
        })
    }
}

async function deletePost(req, res) {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role

        const post = await postService.deletePost(postId, userId, userRole);

        return res.status(200).json(post);

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: err.message || "Something went wrong"
        })
    }
}

async function createComment(req, res) {
    try {

        const { content } = req.body;
        const postId = req.params.id;
        const userId = req.user.id;

        const post = await postService.createComment(content, postId, userId);

        return res.status(201).json(post);

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: err.message || "Something went wrong"
        })
    }
}

async function getComments(req, res) {
    try {
        const postId = req.params.id;

        const comments = await postService.getComments(postId);

        return res.status(200).json(comments);

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: err.message || "Something went wrong"
        });
    }
}

async function updateComment(req, res) {
    try {
        
        const commentId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { content } = req.body;

        const comment = await postService.updateComment(userId, userRole, commentId, content);

        return res.status(200).json(comment);

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: err.message || "Something went wrong"
        })
    }
}

async function deleteComment(req, res) {
    try {
        
        const userId = req.user.id;
        const userRole = req.user.role;
        const commentId = req.params.id;

        const comment = await postService.deleteComment(userId, userRole, commentId);

        return res.status(200).json(comment);

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: err.message || "Something went wrong"
        })
    }
}

module.exports = {
    createPost, getPosts, getPostById,
    updatePost, deletePost, createComment,
    getComments, updateComment, deleteComment
 };    
