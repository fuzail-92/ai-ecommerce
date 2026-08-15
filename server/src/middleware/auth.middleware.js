const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const config = require("../config/env");
const User = require("../modules/users/user.model");

// Middleware to protect routes and verify access token
const protect = asyncHandler(async (req, res, next) => {
  // 1. Get token from Authorization header
  const authHeader = req.headers.authorization;

  let token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authorized, no token provided", 401);
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtAccessSecret);
  } catch (error) {
    throw new AppError("Not authorized, token is invalid or expired", 401);
  }

  // 3. Fetch user from database to ensure they still exist and are active
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError("Not authorized, user no longer exists", 401);
  }

  if (!user.isActive) {
    throw new AppError("Not authorized, account is disabled", 401);
  }

  // 4. Attach user to request object
  req.user = user;

  next();
});

module.exports = {
  protect,
};
