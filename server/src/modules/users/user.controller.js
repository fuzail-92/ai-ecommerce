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

module.exports = {
  getMe,
};
