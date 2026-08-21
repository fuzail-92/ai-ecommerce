const productService = require("./product.service");
const asyncHandler = require("../../utils/asyncHandler");

// Create product (admin only)
const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({ success: true, data: product });
});

// Get product by ID
const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json({ success: true, data: product });
});

// Get product by slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  res.status(200).json({ success: true, data: product });
});

// List products
const listProducts = asyncHandler(async (req, res) => {
  const result = await productService.listProducts(req.query);
  res.status(200).json({ success: true, ...result });
});

// Update product (admin only)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json({ success: true, data: product });
});

// Delete product (admin only)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);
  res.status(200).json({ success: true, data: product });
});

module.exports = {
  createProduct,
  getProductById,
  getProductBySlug,
  listProducts,
  updateProduct,
  deleteProduct,
};
