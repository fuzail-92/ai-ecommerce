const { body } = require("express-validator");

const checkoutValidation = [
  body("addressId")
    .notEmpty()
    .withMessage("Address ID is required")
    .isMongoId()
    .withMessage("Address ID must be a valid MongoDB ID"),
];

module.exports = {
  previewCheckoutValidation: checkoutValidation,
  executeCheckoutValidation: checkoutValidation,
};
