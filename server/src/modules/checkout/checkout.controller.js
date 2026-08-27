const checkoutService = require("./checkout.service");
const asyncHandler = require("../../utils/asyncHandler");

// Preview checkout
const previewCheckout = asyncHandler(async (req, res) => {
  const { addressId } = req.body;
  const result = await checkoutService.previewCheckout(req.user._id, {
    addressId,
  });
  res.status(200).json({ success: true, data: result });
});

// Execute checkout
const executeCheckout = asyncHandler(async (req, res) => {
  const { addressId } = req.body;
  const order = await checkoutService.executeCheckout(req.user._id, {
    addressId,
  });
  res.status(201).json({ success: true, data: order });
});

module.exports = {
  previewCheckout,
  executeCheckout,
};
