const { body, param } = require("express-validator");

const addProductValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID"),
];

const removeProductValidation = [
  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID"),
];

module.exports = {
  addProductValidation,
  removeProductValidation,
};
