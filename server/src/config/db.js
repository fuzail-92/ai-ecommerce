const mongoose = require("mongoose");
const config = require("./env");

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.mongodbUri);

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
