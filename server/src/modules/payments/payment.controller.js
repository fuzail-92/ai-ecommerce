const paymentService = require("./payment.service");
const asyncHandler = require("../../utils/asyncHandler");

// Create payment intent (protected)
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const result = await paymentService.createPaymentIntent(
    orderId,
    req.user._id,
  );
  res.status(201).json({ success: true, data: result });
});

// Webhook (public, from payment gateway)
const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-webhook-signature"];
  const payload = req.body;

  const result = await paymentService.handleWebhook(payload, signature);
  res.status(200).json({ success: true, message: result.message });
});

module.exports = {
  createPaymentIntent,
  handleWebhook,
};
