const reviewService = require("./review.service");
const asyncHandler = require("../../utils/asyncHandler");

// Create review (protected)
const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, review } = req.body;
  const newReview = await reviewService.createReview(req.user._id, {
    productId,
    rating,
    title,
    review,
  });
  res.status(201).json({ success: true, data: newReview });
});

// Update review (owner only)
const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const updateData = req.body;
  const review = await reviewService.updateReview(
    reviewId,
    req.user._id,
    updateData,
  );
  res.status(200).json({ success: true, data: review });
});

// Delete review (owner or admin)
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const review = await reviewService.deleteReview(
    reviewId,
    req.user._id,
    req.user.role,
  );
  res.status(200).json({ success: true, data: review });
});

// List product reviews (public)
const listProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const result = await reviewService.listProductReviews(productId, req.query);
  res.status(200).json({ success: true, ...result });
});

// Get average rating (public)
const getAverageRating = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const rating = await reviewService.getAverageRating(productId);
  res.status(200).json({ success: true, data: rating });
});

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  listProductReviews,
  getAverageRating,
};
