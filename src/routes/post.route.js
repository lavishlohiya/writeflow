const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const postController = require("../controllers/post.controller");

const router = express.Router();

/**
 * POST /api/post/create
 * To create the post
 */
router.post("/create", authMiddleware, postController.createPost);

/**
 * GET /api/post/
 * To get all the posts
 */
router.get("/", authMiddleware, postController.getPosts);

/**
 * GET /api/post/:id 
 * To get the post by id
 */
router.get("/:id", authMiddleware, postController.getPostById);

/**
 * PATCH /api/post/:id
 * To update the content of the post by id
 */
router.patch("/:id", authMiddleware, postController.updatePost);

/**
 * DELETE /api/post/:id
 * To delete the post by its id
 */
router.delete("/:id", authMiddleware, postController.deletePost);

/**
 * POST /api/post/comment/:id
 * To add comment in the post 
 */
router.post("/comment/:id", authMiddleware, postController.createComment);

/**
 * GET /api/post/comment/:id
 * To get all the comments of the post
 */
router.get("/comment/:id", authMiddleware, postController.getComments);

/**
 * PUT /api/post/comment/:id
 * To update the comment of the post
 */
router.put("/comment/:id", authMiddleware, postController.updateComment);

/**
 * DELETE /api/post/comment/:id
 * To delete the comment by the id
 */
router.delete("/comment/:id", authMiddleware, postController.deleteComment);

module.exports = router;