const asyncHandler = require("../../utils/asyncHandler");
const User = require("./user.model");

// Get current logged-in user profile
const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

// Get all users (admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

module.exports = {
  getMe,
  getAllUsers,
};
