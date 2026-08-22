const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");
const validate = require("../../middleware/validate.middleware");

const {
  categoryValidation,
  categoryUpdateValidation,
} = require("./category.validation");

// Public routes
router.get("/", categoryController.listCategories);
router.get("/slug/:slug", categoryController.getCategoryBySlug);
router.get("/:id", categoryController.getCategoryById);

// Admin routes
router.post(
  "/",
  authMiddleware.protect,
  authorize("admin"),
  categoryController.createCategory,
);

router.put(
  "/:id",
  authMiddleware.protect,
  authorize("admin"),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  authMiddleware.protect,
  authorize("admin"),
  categoryController.deleteCategory,
);

// Admin routes
router.post(
  "/",
  authMiddleware.protect,
  authorize("admin"),
  ...categoryValidation,
  validate,
  categoryController.createCategory,
);

router.put(
  "/:id",
  authMiddleware.protect,
  authorize("admin"),
  ...categoryUpdateValidation,
  validate,
  categoryController.updateCategory,
);
module.exports = router;
