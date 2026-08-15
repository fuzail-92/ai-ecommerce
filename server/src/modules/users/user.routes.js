const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authMiddleware = require("../../middleware/auth.middleware");

// Protected route: get current user profile
router.get("/me", authMiddleware.protect, userController.getMe);

module.exports = router;
