const express = require("express");
const router = express.Router();
const paymentController = require("./payment.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const { createPaymentIntentValidation } = require("./payment.validation");

// Protected: create payment intent
router.post(
  "/create-intent",
  authMiddleware.protect,
  createPaymentIntentValidation,
  validate,
  paymentController.createPaymentIntent,
);

// Webhook: public, signature verified in service
router.post("/webhook", paymentController.handleWebhook);

module.exports = router;
