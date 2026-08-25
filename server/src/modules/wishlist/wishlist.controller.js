const wishlistService = require("./wishlist.service");
const asyncHandler = require("../../utils/asyncHandler");

// Get wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user._id);
  res.status(200).json({ success: true, data: wishlist });
});

// Add product to wishlist
const addProductToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const wishlist = await wishlistService.addProductToWishlist(
    req.user._id,
    productId,
  );
  res.status(200).json({ success: true, data: wishlist });
});

// Remove product from wishlist
const removeProductFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const wishlist = await wishlistService.removeProductFromWishlist(
    req.user._id,
    productId,
  );
  res.status(200).json({ success: true, data: wishlist });
});

module.exports = {
  getWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
};
