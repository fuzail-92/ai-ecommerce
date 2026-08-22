const Category = require("./category.model");
const AppError = require("../../utils/appError");

// Create a new category
const createCategory = async (categoryData) => {
  const category = await Category.create(categoryData);
  return category;
};

// Get all categories
const listCategories = async () => {
  return Category.find({}).sort({ name: 1 });
};

// Get category by ID
const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new AppError("Category not found", 404);
  return category;
};

// Get category by slug
const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug });
  if (!category) throw new AppError("Category not found", 404);
  return category;
};

// Update category
const updateCategory = async (categoryId, updateData) => {
  const category = await Category.findByIdAndUpdate(categoryId, updateData, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!category) throw new AppError("Category not found", 404);
  return category;
};

// Soft delete category
const deleteCategory = async (categoryId) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { isActive: false },
    { new: true },
  );
  if (!category) throw new AppError("Category not found", 404);
  return category;
};

module.exports = {
  createCategory,
  listCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
};
