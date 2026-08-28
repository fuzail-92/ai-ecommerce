const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");
const validate = require("../../middleware/validate.middleware");
const {
  cancelOrderValidation,
  updateOrderStatusValidation,
} = require("./order.validation");

// All order routes require authentication
router.use(authMiddleware.protect);

// User routes
router.get("/", orderController.getUserOrders);
router.get("/:orderId", orderController.getOrderById);
router.post(
  "/:orderId/cancel",
  cancelOrderValidation,
  validate,
  orderController.cancelOrder,
);

// Admin routes
router.patch(
  "/:orderId/status",
  authorize("admin"),
  updateOrderStatusValidation,
  validate,
  orderController.updateOrderStatus,
);

module.exports = router;
