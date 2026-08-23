const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");
const authMiddleware = require("../../middleware/auth.middleware");

// All cart routes are protected
router.use(authMiddleware.protect);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItemToCart);
router.put("/items/:itemId", cartController.updateCartItemQuantity);
router.delete("/items/:itemId", cartController.removeCartItem);
router.delete("/", cartController.clearCart);
router.get("/totals", cartController.getCartTotals);

module.exports = router;
