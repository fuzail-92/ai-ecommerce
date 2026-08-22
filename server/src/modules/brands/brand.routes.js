const express = require("express");
const router = express.Router();
const brandController = require("./brand.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");

// Public routes
router.get("/", brandController.listBrands);
router.get("/slug/:slug", brandController.getBrandBySlug);
router.get("/:id", brandController.getBrandById);

// Admin routes
router.post(
  "/",
  authMiddleware.protect,
  authorize("admin"),
  brandController.createBrand,
);

router.put(
  "/:id",
  authMiddleware.protect,
  authorize("admin"),
  brandController.updateBrand,
);

router.delete(
  "/:id",
  authMiddleware.protect,
  authorize("admin"),
  brandController.deleteBrand,
);

module.exports = router;
