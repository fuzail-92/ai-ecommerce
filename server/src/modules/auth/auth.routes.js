const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const validate = require("../../middleware/validate.middleware");
const {
  registerValidation,
  loginValidation,
  refreshValidation,
  logoutValidation,
} = require("./auth.validation");

// POST /api/v1/auth/register
router.post("/register", registerValidation, validate, authController.register);

// POST /api/v1/auth/login
router.post("/login", loginValidation, validate, authController.login);

// POST /api/v1/auth/refresh
router.post("/refresh", refreshValidation, validate, authController.refresh);

// POST /api/v1/auth/logout
router.post("/logout", logoutValidation, validate, authController.logout);

module.exports = router;
