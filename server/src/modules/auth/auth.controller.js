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

// Refresh access token
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const tokens = await authService.refreshAccessToken({ refreshToken });

  res.status(200).json({
    success: true,
    data: tokens,
  });
});

// Logout user
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  await authService.logoutUser({ refreshToken });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
};
