const brandService = require("./brand.service");
const asyncHandler = require("../../utils/asyncHandler");

// Create brand (admin only)
const createBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.createBrand(req.body);
  res.status(201).json({ success: true, data: brand });
});

// List all brands (public)
const listBrands = asyncHandler(async (req, res) => {
  const brands = await brandService.listBrands();
  res.status(200).json({ success: true, count: brands.length, data: brands });
});

// Get brand by ID (public)
const getBrandById = asyncHandler(async (req, res) => {
  const brand = await brandService.getBrandById(req.params.id);
  res.status(200).json({ success: true, data: brand });
});

// Get brand by slug (public)
const getBrandBySlug = asyncHandler(async (req, res) => {
  const brand = await brandService.getBrandBySlug(req.params.slug);
  res.status(200).json({ success: true, data: brand });
});

// Update brand (admin only)
const updateBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.updateBrand(req.params.id, req.body);
  res.status(200).json({ success: true, data: brand });
});

// Delete brand (admin only)
const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.deleteBrand(req.params.id);
  res.status(200).json({ success: true, data: brand });
});

module.exports = {
  createBrand,
  listBrands,
  getBrandById,
  getBrandBySlug,
  updateBrand,
  deleteBrand,
};
