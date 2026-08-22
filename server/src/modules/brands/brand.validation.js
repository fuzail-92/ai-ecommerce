const { body } = require("express-validator");

const brandValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ max: 100 })
    .withMessage("Brand name cannot exceed 100 characters"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Brand slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must be lowercase, hyphen-separated, and contain only letters and numbers",
    ),
];

const brandUpdateValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Brand name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Brand name cannot exceed 100 characters"),

  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage(
      "Slug must be lowercase, hyphen-separated, and contain only letters and numbers",
    ),
];

module.exports = {
  brandValidation,
  brandUpdateValidation,
};
