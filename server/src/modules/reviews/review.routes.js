const express = require("express");
const router = express.Router();
const reviewController = require("./review.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");
const validate = require("../../middleware/validate.middleware");
const {
  createReviewValidation,
  updateReviewValidation,
} = require("./review.validation");

// Public routes
router.get("/product/:productId", reviewController.listProductReviews);
router.get("/product/:productId/average", reviewController.getAverageRating);

// Protected routes
router.post(
  "/",
  authMiddleware.protect,
  createReviewValidation,
  validate,
  reviewController.createReview,
);

router.put(
  "/:reviewId",
  authMiddleware.protect,
  updateReviewValidation,
  validate,
  reviewController.updateReview,
);

router.delete(
  "/:reviewId",
  authMiddleware.protect,
  reviewController.deleteReview,
);

module.exports = router;
