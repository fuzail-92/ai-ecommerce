const Inventory = require("./inventory.model");
const StockMovement = require("./stockMovement.model");
const Product = require("../products/product.model");
const AppError = require("../../utils/appError");

// Helper: Ensure inventory record exists
const ensureInventory = async (productId, variantId = null) => {
  const query = { product: productId, variant: variantId };
  let inventory = await Inventory.findOne(query);

  if (!inventory) {
    inventory = await Inventory.create({
      product: productId,
      variant: variantId,
      stock: 0,
      reservedStock: 0,
      availableStock: 0,
    });
  }
  return inventory;
};

// Get inventory for a product/variant
const getInventory = async (productId, variantId = null) => {
  return await ensureInventory(productId, variantId);
};

// Add stock (IN)
const addStock = async (
  productId,
  variantId,
  quantity,
  reason,
  reference = null,
) => {
  if (quantity <= 0) throw new AppError("Quantity must be positive", 400);

  const inventory = await ensureInventory(productId, variantId);

  // Atomically update stock and availableStock
  inventory.stock += quantity;
  inventory.availableStock += quantity;
  await inventory.save();

  await StockMovement.create({
    inventory: inventory._id,
    product: productId,
    variant: variantId,
    type: "IN",
    quantity,
    reason,
    reference,
  });

  return inventory;
};

// Deduct stock (OUT) — used after successful payment
const deductStock = async (
  productId,
  variantId,
  quantity,
  reason,
  reference = null,
) => {
  if (quantity <= 0) throw new AppError("Quantity must be positive", 400);

  const inventory = await Inventory.findOneAndUpdate(
    { product: productId, variant: variantId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true },
  );

  if (!inventory) {
    throw new AppError("Insufficient stock", 400);
  }

  // Recalculate availableStock after stock change (reserved unchanged)
  inventory.availableStock = inventory.stock - inventory.reservedStock;
  await inventory.save();

  await StockMovement.create({
    inventory: inventory._id,
    product: productId,
    variant: variantId,
    type: "OUT",
    quantity,
    reason,
    reference,
  });

  return inventory;
};

// Reserve stock
const reserveStock = async (
  productId,
  variantId,
  quantity,
  reason,
  reference = null,
) => {
  if (quantity <= 0) throw new AppError("Quantity must be positive", 400);

  const inventory = await Inventory.findOneAndUpdate(
    {
      product: productId,
      variant: variantId,
      availableStock: { $gte: quantity },
    },
    { $inc: { reservedStock: quantity, availableStock: -quantity } },
    { new: true },
  );

  if (!inventory) {
    throw new AppError("Insufficient available stock", 400);
  }

  await StockMovement.create({
    inventory: inventory._id,
    product: productId,
    variant: variantId,
    type: "RESERVE",
    quantity,
    reason,
    reference,
  });

  return inventory;
};

// Release reserved stock
const releaseStock = async (
  productId,
  variantId,
  quantity,
  reason,
  reference = null,
) => {
  if (quantity <= 0) throw new AppError("Quantity must be positive", 400);

  const inventory = await Inventory.findOneAndUpdate(
    {
      product: productId,
      variant: variantId,
      reservedStock: { $gte: quantity },
    },
    { $inc: { reservedStock: -quantity, availableStock: quantity } },
    { new: true },
  );

  if (!inventory) {
    throw new AppError("Insufficient reserved stock", 400);
  }

  await StockMovement.create({
    inventory: inventory._id,
    product: productId,
    variant: variantId,
    type: "RELEASE",
    quantity,
    reason,
    reference,
  });

  return inventory;
};

// Adjust stock (manual correction)
const adjustStock = async (
  productId,
  variantId,
  quantity,
  reason,
  reference = null,
) => {
  if (quantity === 0)
    throw new AppError("Adjustment quantity cannot be zero", 400);

  const inventory = await ensureInventory(productId, variantId);
  const previousStock = inventory.stock;
  const newStock = previousStock + quantity;
  if (newStock < 0)
    throw new AppError("Adjustment would result in negative stock", 400);

  inventory.stock = newStock;
  inventory.availableStock = newStock - inventory.reservedStock;
  await inventory.save();

  await StockMovement.create({
    inventory: inventory._id,
    product: productId,
    variant: variantId,
    type: "ADJUST",
    quantity: Math.abs(quantity),
    reason,
    reference,
  });

  return inventory;
};

// List low stock items
const listLowStock = async (threshold = 5) => {
  return await Inventory.find({ stock: { $lte: threshold } })
    .populate("product", "name slug")
    .populate("variant", "options");
};

// Get stock movements
const getStockMovements = async (
  productId,
  variantId = null,
  page = 1,
  limit = 20,
) => {
  const query = { product: productId };
  if (variantId) query.variant = variantId;

  const skip = (Number(page) - 1) * Number(limit);
  const movements = await StockMovement.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await StockMovement.countDocuments(query);
  return {
    movements,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

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
