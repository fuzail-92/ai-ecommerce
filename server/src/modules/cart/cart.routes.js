const express = require("express");

const router = express.Router();

const cartController = require("./cart.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");

const {
  addCartItemValidation,
  updateCartItemValidation,
} = require("./cart.validation");

// All cart routes are protected
router.use(authMiddleware.protect);

router.get("/", cartController.getCart);

router.post(
  "/items",
  ...addCartItemValidation,
  validate,
  cartController.addItemToCart,
);

router.put(
  "/items/:itemId",
  ...updateCartItemValidation,
  validate,
  cartController.updateCartItemQuantity,
);

router.delete("/items/:itemId", cartController.removeCartItem);

router.delete("/", cartController.clearCart);

router.get("/totals", cartController.getCartTotals);

module.exports = router;
