const mongoose = require("mongoose");

// Variant subdocument schema
const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, "Variant SKU is required"],
      unique: true,
      trim: true,
    },
    options: {
      type: Map,
      of: String,
      default: {},
    },
    price: {
      type: Number,
      required: [true, "Variant price is required"],
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    stock: {
      type: Number,
      required: [true, "Variant stock is required"],
      min: 0,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  },
);

// Main product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand is required"],
    },
    price: {
      type: Number,
      required: [true, "Product base price is required"],
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "draft",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    variants: {
      type: [variantSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for common queries
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
