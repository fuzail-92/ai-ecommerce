const mongoose = require("mongoose");
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
  featured,
}) => {
  const query = {};

  // Filter by product status
  if (status) {
    query.status = status;
  }

  // Filter by category ID or category slug
  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    } else {
      const Category = require("../categories/category.model");

      const foundCategory = await Category.findOne({
        slug: category,
      });

      if (!foundCategory) {
        throw new AppError("Category not found", 404);
      }

      query.category = foundCategory._id;
    }
  }

  // Filter by brand ID or brand slug
  if (brand) {
    if (mongoose.Types.ObjectId.isValid(brand)) {
      query.brand = brand;
    } else {
      const Brand = require("../brands/brand.model");

      const foundBrand = await Brand.findOne({
        slug: brand,
      });

      if (!foundBrand) {
        throw new AppError("Brand not found", 404);
      }

      query.brand = foundBrand._id;
    }
  }

  // Filter by featured
  if (featured !== undefined) {
    query.isFeatured = featured === "true";
  }

  // Filter by price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};

    if (minPrice !== undefined) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      query.price.$lte = Number(maxPrice);
    }
  }

  // Search products
  if (search) {
    query.$text = {
      $search: search,
    };
  }

  // Sorting
  const sortOptions = {};
  sortOptions[sort] = order === "asc" ? 1 : -1;

  // Pagination
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Get products
  const products = await Product.find(query)
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber);

  // Count total products
  const totalProducts = await Product.countDocuments(query);

  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / limitNumber);

  return {
    products,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalProducts,
      totalPages,
    },
  };
};

// Update product
const updateProduct = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(productId, updateData, {
    returnDocument: "after",
    runValidators: true,
  })
    .populate("category", "name slug")
    .populate("brand", "name slug");

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

// Soft delete product
const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { status: "archived" },
    {
      returnDocument: "after",
    },
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
