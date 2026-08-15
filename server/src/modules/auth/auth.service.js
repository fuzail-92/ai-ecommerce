const bcrypt = require("bcrypt");
const AppError = require("../../utils/appError");
const User = require("../users/user.model");

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

module.exports = {
  registerUser,
};
