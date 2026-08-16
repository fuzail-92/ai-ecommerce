const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const validate = require("../../middleware/validate.middleware");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("./auth.validation");

// Register
router.post(
  "/register",
  ...registerValidation,
  validate,
  authController.register,
);

// Login
router.post("/login", ...loginValidation, validate, authController.login);

// Forgot password
router.post(
  "/forgot-password",
  ...forgotPasswordValidation,
  validate,
  authController.forgotPassword,
);

// Reset password
router.post(
  "/reset-password/:token",
  ...resetPasswordValidation,
  validate,
  authController.resetPassword,
);

// Refresh token
router.post("/refresh", authController.refresh);

// Logout
router.post("/logout", authController.logout);

module.exports = router;
