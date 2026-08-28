const Order = require("./order.model");
const AppError = require("../../utils/appError");
const inventoryService = require("../inventory/inventory.service");

// Allowed order state transitions
const allowedTransitions = {
  CREATED: ["PAYMENT_PENDING", "CANCELLED"],
  PAYMENT_PENDING: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["RETURNED"],
  RETURNED: [],
  CANCELLED: [],
};

// Helper: Check if transition is allowed
const isTransitionAllowed = (currentStatus, newStatus) => {
  return allowedTransitions[currentStatus]?.includes(newStatus) || false;
};

// Get user's orders
const getUserOrders = async (userId, { page = 1, limit = 10 }) => {
  const skip = (Number(page) - 1) * Number(limit);

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Order.countDocuments({ user: userId });
  const totalPages = Math.ceil(total / Number(limit));

  return {
    orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
    },
  };
};

// Get order by ID (with authorization check)
const getOrderById = async (orderId, userId, userRole) => {
  const query = { _id: orderId };
  if (userRole !== "admin") {
    query.user = userId;
  }

  const order = await Order.findOne(query);

  if (!order) {
    throw new AppError("Order not found or you are not authorized", 404);
  }

  return order;
};

// Cancel an order (user can cancel own if allowed)
const cancelOrder = async (orderId, userId, userRole, reason) => {
  const order = await getOrderById(orderId, userId, userRole);

  // Check if cancellation is allowed from current state
  if (!isTransitionAllowed(order.status, "CANCELLED")) {
    throw new AppError(`Cannot cancel order in ${order.status} state`, 400);
  }

  // Release inventory reservations if reservationIds exist
  for (const reservationId of order.reservationIds) {
    // We don't have direct mapping from reservationId to inventory product/variant here,
    // but we stored inventory IDs in reservationIds. We'll use inventory release based on items.
    // Actually our reservationIds stored inventory._id, not reference to product/variant.
    // We need to release by item. Better to store more details later.
    // For now, we'll release using each item's product/variant and quantity.
  }

  // Simpler: loop through items and release reserved stock
  for (const item of order.items) {
    await inventoryService.releaseStock(
      item.product,
      item.variant || null,
      item.quantity,
      "Order cancellation",
      orderId,
    );
  }

  order.status = "CANCELLED";
  order.cancellationReason = reason || null;
  order.paymentStatus = order.paymentStatus === "PAID" ? "REFUNDED" : "FAILED";

  await order.save();

  return order;
};

// Admin: Update order status
const updateOrderStatus = async (orderId, newStatus, adminRole) => {
  if (adminRole !== "admin") {
    throw new AppError("Only admin can update order status", 403);
  }

  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);

  if (!isTransitionAllowed(order.status, newStatus)) {
    throw new AppError(
      `Cannot transition from ${order.status} to ${newStatus}`,
      400,
    );
  }

  order.status = newStatus;
  await order.save();

  return order;
};

module.exports = {
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
};
