const { body } = require("express-validator");

const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 200 })
    .withMessage("Product name cannot exceed 200 characters"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Product slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must be lowercase, hyphen-separated, and contain only letters and numbers",
    ),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ID"),

  body("brand")
    .notEmpty()
    .withMessage("Brand is required")
    .isMongoId()
    .withMessage("Brand must be a valid MongoDB ID"),

  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("status")
    .optional()
    .isIn(["active", "draft", "archived"])
    .withMessage("Status must be active, draft, or archived"),
];

const productUpdateValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Product name cannot exceed 200 characters"),

  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must be lowercase, hyphen-separated, and contain only letters and numbers",
    ),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ID"),

  body("brand")
    .optional()
    .isMongoId()
    .withMessage("Brand must be a valid MongoDB ID"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("status")
    .optional()
    .isIn(["active", "draft", "archived"])
    .withMessage("Status must be active, draft, or archived"),
];

module.exports = {
  productValidation,
  productUpdateValidation,
};
