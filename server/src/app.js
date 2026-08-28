const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const logger = require("./utils/logger");

const config = require("./config/env");
const connectDB = require("./config/db");

// Routes
const healthRoutes = require("./modules/health/health.routes");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const productRoutes = require("./modules/products/product.routes");
const categoryRoutes = require("./modules/categories/category.routes");
const brandRoutes = require("./modules/brands/brand.routes");
const cartRoutes = require("./modules/cart/cart.routes");
const wishlistRoutes = require("./modules/wishlist/wishlist.routes");
const reviewRoutes = require("./modules/reviews/review.routes");
const inventoryRoutes = require("./modules/inventory/inventory.routes");
const checkoutRoutes = require("./modules/checkout/checkout.routes");
const orderRoutes = require("./modules/orders/order.routes");

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// ==========================================
// Global Middleware
// ==========================================

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(morgan("dev"));

// ==========================================
// Routes
// ==========================================

// Health
app.use("/health", healthRoutes);

// Auth
app.use("/api/v1/auth", authRoutes);

// Users
app.use("/api/v1/users", userRoutes);

// Products
app.use("/api/v1/products", productRoutes);

// Categories
app.use("/api/v1/categories", categoryRoutes);

// Brands
app.use("/api/v1/brands", brandRoutes);

// Cart
app.use("/api/v1/cart", cartRoutes);

// Wishlist
app.use("/api/v1/wishlist", wishlistRoutes);

// Reviews
app.use("/api/v1/reviews", reviewRoutes);

app.use("/api/v1/inventory", inventoryRoutes);

app.use("/api/v1/checkout", checkoutRoutes);

app.use("/api/v1/orders", orderRoutes);

// ==========================================
// 404 Handler
// ==========================================

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==========================================
// Centralized Error Handler
// ==========================================

app.use((err, req, res, next) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;

  const message = err.isOperational ? err.message : "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

// ==========================================
// Start Server
// ==========================================

const server = app.listen(config.port, () => {
  logger.info(
    `Server running in ${config.nodeEnv} mode on port ${config.port}`,
  );
});

module.exports = app;
