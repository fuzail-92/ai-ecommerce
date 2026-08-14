// Load environment variables from .env file
require("dotenv").config();

// Centralized configuration object
const config = {
  // Server
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/ai_ecommerce",

  // JWT
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "dev-access-secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // AI Service
  aiServiceUrl: process.env.AI_SERVICE_URL || "http://localhost:8000",
};

module.exports = config;
