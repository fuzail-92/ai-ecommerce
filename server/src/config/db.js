const mongoose = require("mongoose");
const config = require("./env");
const logger = require("../utils/logger");

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.mongodbUri);

    logger.info(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
