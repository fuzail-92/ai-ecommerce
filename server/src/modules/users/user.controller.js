const asyncHandler = require("../../utils/asyncHandler");
const User = require("./user.model");
const userService = require("./user.service");

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

// Get current user profile (detailed)
const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getUserProfile(req.user._id);

  res.status(200).json({
    success: true,
    data: profile,
  });
});

// Update current user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const profile = await userService.updateUserProfile(req.user._id, {
    name,
    email,
  });

  res.status(200).json({
    success: true,
    data: profile,
  });
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const result = await userService.changePassword(req.user._id, {
    currentPassword,
    newPassword,
  });

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

// Add address
const addAddress = asyncHandler(async (req, res) => {
  const addressData = req.body;

  const addresses = await userService.addAddress(req.user._id, addressData);

  res.status(201).json({
    success: true,
    data: addresses,
  });
});

// Update address
const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const addressData = req.body;

  const addresses = await userService.updateAddress(
    req.user._id,
    addressId,
    addressData,
  );

  res.status(200).json({
    success: true,
    data: addresses,
  });
});

// Delete address
const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const addresses = await userService.deleteAddress(req.user._id, addressId);

  res.status(200).json({
    success: true,
    data: addresses,
  });
});

module.exports = {
  getMe,
  getAllUsers,
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
};
