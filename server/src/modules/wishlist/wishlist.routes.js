const express = require("express");
const router = express.Router();
const wishlistController = require("./wishlist.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const {
  addProductValidation,
  removeProductValidation,
} = require("./wishlist.validation");

router.use(authMiddleware.protect);

router.get("/", wishlistController.getWishlist);
router.post(
  "/",
  addProductValidation,
  validate,
  wishlistController.addProductToWishlist,
);
router.delete(
  "/:productId",
  removeProductValidation,
  validate,
  wishlistController.removeProductFromWishlist,
);

module.exports = router;
