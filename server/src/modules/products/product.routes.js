const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");

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

module.exports = router;
