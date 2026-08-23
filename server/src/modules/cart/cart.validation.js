const { body } = require("express-validator");

const addCartItemValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("variantId")
    .optional()
    .isMongoId()
    .withMessage("Variant ID must be a valid MongoDB ID"),
];

const updateCartItemValidation = [
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

module.exports = {
  addCartItemValidation,
  updateCartItemValidation,
};
