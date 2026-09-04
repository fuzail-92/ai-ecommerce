const Order = require('../orders/order.model');
const Product = require('../products/product.model');

// Get dashboard analytics
const getDashboardStats = async () => {
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: 'PAID' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  const totalCustomers = await require('../users/user.model').countDocuments({ role: 'customer' });
  const totalProducts = await Product.countDocuments({ status: 'active' });

  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

  return {
    totalOrders,
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    totalCustomers,
    totalProducts,
    recentOrders,
  };
};

// Get sales by category (top categories)
const getSalesByCategory = async () => {
  return await Product.aggregate([
    { $unwind: '$category' },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
};

module.exports = {
  getDashboardStats,
  getSalesByCategory,
};
