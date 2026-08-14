const express = require("express");
const router = express.Router();
const healthController = require("./health.controller");

// GET /health
router.get("/", healthController.getHealth);

module.exports = router;
