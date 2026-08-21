const Product = require("./product.model");
const AppError = require("../../utils/appError");

// Create a new product
const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

// Get product by ID
const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .populate("category", "name slug")
    .populate("brand", "name slug");

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

// Get product by slug
const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug })
    .populate("category", "name slug")
    .populate("brand", "name slug");

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

// List products with filtering, sorting, and pagination
const listProducts = async ({
  page = 1,
  limit = 10,
  sort = "createdAt",
  order = "desc",
  category,
  brand,
  minPrice,
  maxPrice,
  status = "active",
  search,
}) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (category) {
    query.category = category;
  }

  if (brand) {
    query.brand = brand;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
  }

  if (search) {
    query.$text = { $search: search };
  }

  const sortOptions = {};
  sortOptions[sort] = order === "asc" ? 1 : -1;

  const skip = (Number(page) - 1) * Number(limit);

  const products = await Product.find(query)
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / Number(limit));

  return {
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalProducts,
      totalPages,
    },
  };
};

// Update product
const updateProduct = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("category", "name slug")
    .populate("brand", "name slug");

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

// Soft delete product (set status archived)
const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { status: "archived" },
    { new: true },
  );

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

module.exports = {
  createProduct,
  getProductById,
  getProductBySlug,
  listProducts,
  updateProduct,
  deleteProduct,
};
