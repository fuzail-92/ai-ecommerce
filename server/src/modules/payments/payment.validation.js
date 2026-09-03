const { body } = require("express-validator");

const createPaymentIntentValidation = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Order ID must be a valid MongoDB ID"),
];

module.exports = {
  createPaymentIntentValidation,
};
