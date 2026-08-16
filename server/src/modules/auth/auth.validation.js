const { body } = require("express-validator");

// Validation rules for register
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Validation rules for login
const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

// Validation rules for refresh
const refreshValidation = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

// Validation rules for logout
const logoutValidation = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

// Validation rules for forgot password
const forgotPasswordValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
];

// Validation rules for reset password
const resetPasswordValidation = [
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

module.exports = {
  registerValidation,
  loginValidation,
  refreshValidation,
  logoutValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
