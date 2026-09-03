const crypto = require("crypto");
const Payment = require("./payment.model");
const Order = require("../orders/order.model");
const AppError = require("../../utils/appError");
const config = require("../../config/env");

// Mock webhook secret (in production, this comes from gateway)
const MOCK_WEBHOOK_SECRET = config.mockWebhookSecret || "mock-secret";

// Create a payment intent (mock)
const createPaymentIntent = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new AppError("Order not found", 404);
  if (order.paymentStatus === "PAID")
    throw new AppError("Order already paid", 400);

  // Create payment record
  const payment = await Payment.create({
    order: orderId,
    user: userId,
    amount: order.totalAmount,
    currency: "PKR",
    provider: "mock",
    status: "PENDING",
    metadata: {
      mockIntent: `mock_intent_${orderId}`,
    },
  });

  // Return mock client secret / intent info
  return {
    paymentId: payment._id,
    clientSecret: `mock_secret_${payment._id}`,
    amount: payment.amount,
    currency: payment.currency,
  };
};

// Verify mock webhook signature
const verifyMockSignature = (payload, signature) => {
  const expected = crypto
    .createHmac("sha256", MOCK_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest("hex");
  return expected === signature;
};

// Handle mock webhook event
const handleWebhook = async (payload, signature) => {
  if (!verifyMockSignature(payload, signature)) {
    throw new AppError("Invalid signature", 400);
  }

  const { event, data } = payload;
  const { orderId, paymentId } = data;

  const payment = await Payment.findById(paymentId);
  if (!payment) throw new AppError("Payment not found", 404);

  // Idempotency: if already processed, return early
  if (payment.status === "SUCCESS") {
    return { message: "Already processed", payment };
  }

  if (event === "payment.succeeded") {
    payment.status = "SUCCESS";
    payment.gatewayReference =
      data.gatewayReference || `mock_ref_${Date.now()}`;
    await payment.save();

    // Update order
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = "PAID";
      order.status = "PAID"; // or 'PROCESSING' depending on flow
      await order.save();
    }

    return { message: "Payment success processed", payment };
  }

  if (event === "payment.failed") {
    payment.status = "FAILED";
    await payment.save();

    // Update order paymentStatus
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = "FAILED";
      // Could cancel order or leave as payment pending
      await order.save();
    }

    return { message: "Payment failure processed", payment };
  }

  throw new AppError("Unknown event type", 400);
};

module.exports = {
  createPaymentIntent,
  handleWebhook,
  verifyMockSignature, // export for testing
};
