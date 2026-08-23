const cartService = require("./cart.service");
const asyncHandler = require("../../utils/asyncHandler");

// Get current user's cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  res.status(200).json({ success: true, data: cart });
});

// Add item to cart
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity } = req.body;
  const cart = await cartService.addItemToCart(req.user._id, {
    productId,
    variantId,
    quantity,
  });
  res.status(200).json({ success: true, data: cart });
});

// Update cart item quantity
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cart = await cartService.updateCartItemQuantity(req.user._id, itemId, {
    quantity,
  });
  res.status(200).json({ success: true, data: cart });
});

// Remove cart item
const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const cart = await cartService.removeCartItem(req.user._id, itemId);
  res.status(200).json({ success: true, data: cart });
});

// Clear cart
const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  res.status(200).json({ success: true, data: cart });
});

// Get cart totals
const getCartTotals = asyncHandler(async (req, res) => {
  const totals = await cartService.calculateCartTotals(req.user._id);
  res.status(200).json({ success: true, data: totals });
});

module.exports = {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  getCartTotals,
};
