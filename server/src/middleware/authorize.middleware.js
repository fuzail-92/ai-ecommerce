const AppError = require("../utils/appError");

// Middleware to restrict access based on user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is set by the protect middleware
    if (!req.user) {
      return next(new AppError("Not authorized, user not found", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }

    next();
  };
};

module.exports = authorize;
