const { body, param } = require("express-validator");

const stockValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId(),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 }),
  body("reason").optional().trim().isLength({ max: 200 }),
  body("reference").optional().trim().isLength({ max: 100 }),
];

const addStockValidation = [...stockValidation];
const deductStockValidation = [...stockValidation];
const reserveStockValidation = [...stockValidation];
const releaseStockValidation = [...stockValidation];
const adjustStockValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId(),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .custom((value, { req }) => {
      if (req.body.type === "ADJUST" && value === 0)
        throw new Error("Adjustment quantity cannot be zero");
      return true;
    }),
  body("reason").optional().trim().isLength({ max: 200 }),
  body("reference").optional().trim().isLength({ max: 100 }),
];

module.exports = {
  addStockValidation,
  deductStockValidation,
  reserveStockValidation,
  releaseStockValidation,
  adjustStockValidation,
};
