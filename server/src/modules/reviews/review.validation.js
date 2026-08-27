const { body, param } = require("express-validator");

const createReviewValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("review")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Review cannot exceed 2000 characters"),
];

const updateReviewValidation = [
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("review")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Review cannot exceed 2000 characters"),
];

module.exports = {
  createReviewValidation,
  updateReviewValidation,
};
