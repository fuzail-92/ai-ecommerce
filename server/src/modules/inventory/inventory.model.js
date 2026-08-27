const mongoose = require("mongoose");

// Inventory record for a product or variant
const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    reservedStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    availableStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      min: 0,
      default: 5,
    },
  },
  {
    timestamps: true,
  },
);

// Unique compound index: one inventory record per product/variant combination
inventorySchema.index({ product: 1, variant: 1 }, { unique: true });

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
