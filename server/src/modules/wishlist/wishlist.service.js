const Wishlist = require("./wishlist.model");
const Product = require("../products/product.model");
const AppError = require("../../utils/appError");

// Get or create wishlist for user
const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [],
    });
  }

  return wishlist;
};

// Get user's wishlist with product details populated
const getWishlist = async (userId) => {
  const wishlist = await getOrCreateWishlist(userId);

  await wishlist.populate({
    path: "products.product",
    select: "name slug price images status",
  });

  return wishlist;
};

// Add product to wishlist
const addProductToWishlist = async (userId, productId) => {
  // Validate product exists and is active
  const product = await Product.findById(productId);

  if (!product || product.status !== "active") {
    throw new AppError("Product not found or not available", 404);
  }

  const wishlist = await getOrCreateWishlist(userId);

  // Prevent duplicate product
  const existing = wishlist.products.find(
    (item) => item.product.toString() === productId,
  );

  if (existing) {
    throw new AppError("Product already in wishlist", 409);
  }

  wishlist.products.push({
    product: productId,
  });

  await wishlist.save();

  await wishlist.populate({
    path: "products.product",
    select: "name slug price images status",
  });

  return wishlist;
};

// Remove product from wishlist
const removeProductFromWishlist = async (userId, productId) => {
  const wishlist = await getOrCreateWishlist(userId);

  const item = wishlist.products.find(
    (entry) => entry.product.toString() === productId,
  );

  if (!item) {
    throw new AppError("Product not found in wishlist", 404);
  }

  // Remove wishlist item from the products array
  wishlist.products.pull(item._id);

  await wishlist.save();

  await wishlist.populate({
    path: "products.product",
    select: "name slug price images status",
  });

  return wishlist;
};

// Move product from wishlist to cart
// Currently this only removes the product from wishlist.
// Actual cart integration can be implemented later.
const moveProductToCart = async (userId, productId) => {
  const wishlist = await removeProductFromWishlist(userId, productId);

  return {
    wishlist,
    moved: true,
  };
};

module.exports = {
  getWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  moveProductToCart,
};
