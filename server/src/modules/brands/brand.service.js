const Brand = require("./brand.model");
const AppError = require("../../utils/appError");

// Create a new brand
const createBrand = async (brandData) => {
  const brand = await Brand.create(brandData);
  return brand;
};

// Get all brands
const listBrands = async () => {
  return Brand.find({}).sort({ name: 1 });
};

// Get brand by ID
const getBrandById = async (brandId) => {
  const brand = await Brand.findById(brandId);
  if (!brand) throw new AppError("Brand not found", 404);
  return brand;
};

// Get brand by slug
const getBrandBySlug = async (slug) => {
  const brand = await Brand.findOne({ slug });
  if (!brand) throw new AppError("Brand not found", 404);
  return brand;
};

// Update brand
const updateBrand = async (brandId, updateData) => {
  const brand = await Brand.findByIdAndUpdate(brandId, updateData, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!brand) throw new AppError("Brand not found", 404);
  return brand;
};

// Soft delete brand
const deleteBrand = async (brandId) => {
  const brand = await Brand.findByIdAndUpdate(
    brandId,
    { isActive: false },
    { new: true },
  );
  if (!brand) throw new AppError("Brand not found", 404);
  return brand;
};

module.exports = {
  createBrand,
  listBrands,
  getBrandById,
  getBrandBySlug,
  updateBrand,
  deleteBrand,
};
