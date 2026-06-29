const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * POST /api/auth/register
 * Register the user 
 */
router.post("/register", authController.register);

/**
 * POST /api/auth/login
 * Login the user
 */
router.post("/login", authController.login);

/**
 * POST /api/auth/logout
 * Clear the auth cookie
 */
router.post("/logout", authController.logout);

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get("/me", authMiddleware, authController.me);

module.exports = router;
