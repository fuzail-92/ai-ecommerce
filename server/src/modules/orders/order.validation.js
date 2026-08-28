const { body, param } = require("express-validator");

const cancelOrderValidation = [
  param("orderId").notEmpty().withMessage("Order ID is required").isMongoId(),
  body("reason").optional().trim().isLength({ max: 500 }),
];

const updateOrderStatusValidation = [
  param("orderId").notEmpty().withMessage("Order ID is required").isMongoId(),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "CREATED",
      "PAYMENT_PENDING",
      "PAID",
      "PROCESSING",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
      "RETURNED",
    ]),
];

module.exports = {
  cancelOrderValidation,
  updateOrderStatusValidation,
};
