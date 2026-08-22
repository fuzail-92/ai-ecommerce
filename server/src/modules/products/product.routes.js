const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");
const validate = require("../../middleware/validate.middleware");
const {
  productValidation,
  productUpdateValidation,
} = require("./product.validation");

// Public routes
router.get("/", productController.listProducts);
router.get("/slug/:slug", productController.getProductBySlug);
router.get("/:id", productController.getProductById);

// Admin routes
router.post(
  "/",
  authMiddleware.protect,
  authorize("admin"),
  productController.createProduct,
);

router.put(
  "/:id",
  authMiddleware.protect,
  authorize("admin"),
  productController.updateProduct,
);

router.delete(
  "/:id",
  authMiddleware.protect,
  authorize("admin"),
  productController.deleteProduct,
);

router.post(
  "/",
  authMiddleware.protect,
  authorize("admin"),
  ...productValidation,
  validate,
  productController.createProduct,
);

router.put(
  "/:id",
  authMiddleware.protect,
  authorize("admin"),
  ...productUpdateValidation,
  validate,
  productController.updateProduct,
);

module.exports = router;
