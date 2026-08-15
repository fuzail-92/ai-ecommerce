const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");

// Protected route: get current user profile
router.get("/me", authMiddleware.protect, userController.getMe);

// Admin-only route: get all users
router.get(
  "/",
  authMiddleware.protect,
  authorize("admin"),
  userController.getAllUsers,
);

module.exports = router;
