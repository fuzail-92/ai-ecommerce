const express = require("express");
const router = express.Router();
const inventoryController = require("./inventory.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");
const validate = require("../../middleware/validate.middleware");
const {
  addStockValidation,
  deductStockValidation,
  reserveStockValidation,
  releaseStockValidation,
  adjustStockValidation,
} = require("./inventory.validation");

// Admin only routes for stock adjustments
router.post(
  "/add",
  authMiddleware.protect,
  authorize("admin"),
  addStockValidation,
  validate,
  inventoryController.addStock,
);
router.post(
  "/deduct",
  authMiddleware.protect,
  authorize("admin"),
  deductStockValidation,
  validate,
  inventoryController.deductStock,
);
router.post(
  "/adjust",
  authMiddleware.protect,
  authorize("admin"),
  adjustStockValidation,
  validate,
  inventoryController.adjustStock,
);

// System reserve/release (protected, can be used internally)
router.post(
  "/reserve",
  authMiddleware.protect,
  reserveStockValidation,
  validate,
  inventoryController.reserveStock,
);
router.post(
  "/release",
  authMiddleware.protect,
  releaseStockValidation,
  validate,
  inventoryController.releaseStock,
);

// Public/admin queries
router.get(
  "/low-stock",
  authMiddleware.protect,
  authorize("admin"),
  inventoryController.listLowStock,
);
router.get(
  "/:productId",
  authMiddleware.protect,
  inventoryController.getInventory,
);
router.get(
  "/:productId/movements",
  authMiddleware.protect,
  inventoryController.getStockMovements,
);

module.exports = router;
