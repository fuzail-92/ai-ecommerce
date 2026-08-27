const express = require("express");
const router = express.Router();
const checkoutController = require("./checkout.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const {
  previewCheckoutValidation,
  executeCheckoutValidation,
} = require("./checkout.validation");

router.use(authMiddleware.protect);

router.post(
  "/preview",
  previewCheckoutValidation,
  validate,
  checkoutController.previewCheckout,
);
router.post(
  "/",
  executeCheckoutValidation,
  validate,
  checkoutController.executeCheckout,
);

module.exports = router;
