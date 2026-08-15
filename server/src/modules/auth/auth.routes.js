const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");

// POST /api/v1/auth/register
router.post("/register", authController.register);

module.exports = router;
