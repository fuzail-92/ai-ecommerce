const authService = require("./auth.service");
const asyncHandler = require("../../utils/asyncHandler");

// Register a new user
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await authService.registerUser({ name, email, password });

  res.status(201).json({
    success: true,
    data: user,
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.loginUser({ email, password });

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  register,
  login,
};
