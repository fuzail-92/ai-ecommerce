const mongoose = require("mongoose");
const Review = require("./review.model");
const Product = require("../products/product.model");
const AppError = require("../../utils/appError");

// Create a review
const createReview = async (userId, { productId, rating, title, review }) => {
  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    user: userId,
    product: productId,
  });
  if (existingReview) {
    throw new AppError("You have already reviewed this product", 409);
  }

  const newReview = await Review.create({
    user: userId,
    product: productId,
    rating,
    title,
    review,
  });

  return newReview;
};

// Update a review (owner only)
const updateReview = async (reviewId, userId, updateData) => {
  const review = await Review.findOneAndUpdate(
    { _id: reviewId, user: userId },
    updateData,
    { returnDocument: "after", runValidators: true },
  );

  if (!review) {
    throw new AppError("Review not found or you are not authorized", 404);
  }

  return review;
};

// Delete a review (owner or admin)
const deleteReview = async (reviewId, userId, userRole) => {
  const query = { _id: reviewId };

  // Admin can delete any review; normal user only own review
  if (userRole !== "admin") {
    query.user = userId;
  }

  const review = await Review.findOneAndDelete(query);

  if (!review) {
    throw new AppError("Review not found or you are not authorized", 404);
  }

  return review;
};

// List reviews for a product (public, only approved)
const listProductReviews = async (productId, { page = 1, limit = 10 }) => {
  const skip = (Number(page) - 1) * Number(limit);

  const query = { product: productId, status: "approved" };

  const reviews = await Review.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalReviews = await Review.countDocuments(query);
  const totalPages = Math.ceil(totalReviews / Number(limit));

  return {
    reviews,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalReviews,
      totalPages,
    },
  };
};

// Get average rating for a product
const getAverageRating = async (productId) => {
  const result = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: "approved",
      },
    },
    {
      $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } },
    },
  ]);

  if (result.length === 0) {
    return { avgRating: 0, count: 0 };
  }

  return {
    avgRating: result[0].avgRating.toFixed(1),
    count: result[0].count,
  };
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  listProductReviews,
  getAverageRating,
};
