const inventoryService = require("./inventory.service");
const asyncHandler = require("../../utils/asyncHandler");

// Get inventory
const getInventory = asyncHandler(async (req, res) => {
  const { productId, variantId } = req.params;
  const inventory = await inventoryService.getInventory(
    productId,
    variantId || null,
  );
  res.status(200).json({ success: true, data: inventory });
});

// Add stock (admin)
const addStock = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity, reason, reference } = req.body;
  const inventory = await inventoryService.addStock(
    productId,
    variantId || null,
    quantity,
    reason,
    reference,
  );
  res.status(200).json({ success: true, data: inventory });
});

// Deduct stock (admin)
const deductStock = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity, reason, reference } = req.body;
  const inventory = await inventoryService.deductStock(
    productId,
    variantId || null,
    quantity,
    reason,
    reference,
  );
  res.status(200).json({ success: true, data: inventory });
});

// Reserve stock (system)
const reserveStock = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity, reason, reference } = req.body;
  const inventory = await inventoryService.reserveStock(
    productId,
    variantId || null,
    quantity,
    reason,
    reference,
  );
  res.status(200).json({ success: true, data: inventory });
});

// Release stock (system)
const releaseStock = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity, reason, reference } = req.body;
  const inventory = await inventoryService.releaseStock(
    productId,
    variantId || null,
    quantity,
    reason,
    reference,
  );
  res.status(200).json({ success: true, data: inventory });
});

// Adjust stock (admin)
const adjustStock = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity, reason, reference } = req.body;
  const inventory = await inventoryService.adjustStock(
    productId,
    variantId || null,
    quantity,
    reason,
    reference,
  );
  res.status(200).json({ success: true, data: inventory });
});

// List low stock (admin)
const listLowStock = asyncHandler(async (req, res) => {
  const { threshold } = req.query;
  const items = await inventoryService.listLowStock(Number(threshold) || 5);
  res.status(200).json({ success: true, count: items.length, data: items });
});

// Get stock movements
const getStockMovements = asyncHandler(async (req, res) => {
  const { productId, variantId } = req.params;
  const result = await inventoryService.getStockMovements(
    productId,
    variantId || null,
    req.query.page,
    req.query.limit,
  );
  res.status(200).json({ success: true, ...result });
});

module.exports = {
  getInventory,
  addStock,
  deductStock,
  reserveStock,
  releaseStock,
  adjustStock,
  listLowStock,
  getStockMovements,
};
