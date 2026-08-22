const categoryService = require("./category.service");
const asyncHandler = require("../../utils/asyncHandler");

// Create category (admin only)
const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({ success: true, data: category });
});

// List all categories (public)
const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories();
  res
    .status(200)
    .json({ success: true, count: categories.length, data: categories });
});

// Get category by ID (public)
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  res.status(200).json({ success: true, data: category });
});

// Get category by slug (public)
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  res.status(200).json({ success: true, data: category });
});

// Update category (admin only)
const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body,
  );
  res.status(200).json({ success: true, data: category });
});

// Delete category (admin only)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.deleteCategory(req.params.id);
  res.status(200).json({ success: true, data: category });
});

module.exports = {
  createCategory,
  listCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
};
