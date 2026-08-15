const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../../utils/appError");
const User = require("../users/user.model");
const config = require("../../config/env");

// Register a new user
const registerUser = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Return safe user object (without password)
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

// Login a user
const loginUser = async ({ email, password }) => {
  // Find user by email and include password field
  const user = await User.findOne({ email }).select("+password");

  // If user not found, throw generic error (do not reveal which was wrong)
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare provided password with stored hash
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate access token (short-lived)
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    config.jwtAccessSecret,
    { expiresIn: config.jwtAccessExpiresIn },
  );

  // Generate refresh token (long-lived)
  const refreshToken = jwt.sign({ userId: user._id }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
