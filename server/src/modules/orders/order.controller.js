const orderService = require("./order.service");
const asyncHandler = require("../../utils/asyncHandler");

// Get user's orders
const getUserOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getUserOrders(req.user._id, req.query);
  res.status(200).json({ success: true, ...result });
});

// Get order by ID (user or admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(
    req.params.orderId,
    req.user._id,
    req.user.role,
  );
  res.status(200).json({ success: true, data: order });
});

// Cancel order
const cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const order = await orderService.cancelOrder(
    req.params.orderId,
    req.user._id,
    req.user.role,
    reason,
  );
  res.status(200).json({ success: true, data: order });
});

// Admin: Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(
    req.params.orderId,
    status,
    req.user.role,
  );
  res.status(200).json({ success: true, data: order });
});

module.exports = {
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
};
