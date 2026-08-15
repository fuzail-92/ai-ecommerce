const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");

// Middleware to check validation results from express-validator
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((error) => error.msg);
    return next(new AppError(messages.join(", "), 400));
  }

  next();
};

module.exports = validate;
