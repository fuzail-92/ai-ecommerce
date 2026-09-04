const analyticsService = require('./analytics.service');
const asyncHandler = require('../../utils/asyncHandler');

// Get dashboard stats (admin only)
const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getDashboardStats();
  res.status(200).json({ success: true, data: stats });
});

// Get sales by category (admin only)
const getSalesByCategory = asyncHandler(async (req, res) => {
  const sales = await analyticsService.getSalesByCategory();
  res.status(200).json({ success: true, data: sales });
});

module.exports = {
  getDashboardStats,
  getSalesByCategory,
};
