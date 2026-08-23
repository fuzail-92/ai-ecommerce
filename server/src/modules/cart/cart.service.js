const Cart = require("./cart.model");
const Product = require("../products/product.model");
const AppError = require("../../utils/appError");

// Helper: Get or create cart for a user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

// Get user's cart with product details populated
const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await cart.populate({
    path: "items.product",
    select: "name slug price images status",
  });
  return cart;
};

// Add item to cart
const addItemToCart = async (
  userId,
  { productId, variantId = null, quantity = 1 },
) => {
  // 1. Validate product exists and is active
  const product = await Product.findById(productId);
  if (!product || product.status !== "active") {
    throw new AppError("Product not found or not available", 404);
  }

  // 2. Determine price
  let price = product.price;
  let variant = null;

  // If variantId provided, find variant and override price
  if (variantId) {
    variant = product.variants.id(variantId);
    if (!variant) {
      throw new AppError("Variant not found for this product", 404);
    }
    price =
      variant.price !== undefined && variant.price !== null
        ? variant.price
        : product.price;
  }

  // 3. Get or create cart
  const cart = await getOrCreateCart(userId);

  // 4. Check if same product/variant already exists in cart
  const existingItem = cart.items.find((item) => {
    if (variantId) {
      return (
        item.product.toString() === productId &&
        item.variant &&
        item.variant.toString() === variantId
      );
    }
    return item.product.toString() === productId && !item.variant;
  });

  if (existingItem) {
    existingItem.quantity += Number(quantity);
    existingItem.price = price; // update price snapshot
  } else {
    cart.items.push({
      product: productId,
      variant: variantId,
      quantity: Number(quantity),
      price,
    });
  }

  await cart.save();
  await cart.populate({
    path: "items.product",
    select: "name slug price images status",
  });

  return cart;
};

// Update item quantity
const updateCartItemQuantity = async (userId, itemId, { quantity }) => {
  if (!quantity || quantity < 1) {
    throw new AppError("Quantity must be at least 1", 400);
  }

  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);

  if (!item) {
    throw new AppError("Cart item not found", 404);
  }

  item.quantity = Number(quantity);
  await cart.save();
  await cart.populate({
    path: "items.product",
    select: "name slug price images status",
  });

  return cart;
};

// Remove item from cart
const removeCartItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);

  if (!item) {
    throw new AppError("Cart item not found", 404);
  }

  cart.items.pull(itemId);
  await cart.save();
  await cart.populate({
    path: "items.product",
    select: "name slug price images status",
  });

  return cart;
};

// Clear entire cart
const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
  return cart;
};

// Calculate cart totals (without shipping/tax yet, will expand in checkout)
const calculateCartTotals = async (userId) => {
  const cart = await getCart(userId);

  let subtotal = 0;
  cart.items.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal,
    totalItems,
    items: cart.items,
  };
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  calculateCartTotals,
};
