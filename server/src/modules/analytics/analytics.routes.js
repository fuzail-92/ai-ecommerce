const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

router.use(authMiddleware.protect, authorize('admin'));

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/sales-by-category', analyticsController.getSalesByCategory);

module.exports = router;
