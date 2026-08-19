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

// Admin: Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await userService.getUserById(userId);
  res.status(200).json({ success: true, data: user });
});

// Admin: Update user role
const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const user = await userService.updateUserRole(userId, { role });
  res.status(200).json({ success: true, data: user });
});

// Admin: Deactivate user
const deactivateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await userService.deactivateUser(userId);
  res.status(200).json({ success: true, data: user });
});

// Admin: Activate user
const activateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await userService.activateUser(userId);
  res.status(200).json({ success: true, data: user });
});
// Get user preferences
const getPreferences = asyncHandler(async (req, res) => {
  const preferences = await userService.getUserPreferences(req.user._id);
  res.status(200).json({ success: true, data: preferences });
});

// Update user preferences
const updatePreferences = asyncHandler(async (req, res) => {
  const preferencesData = req.body;
  const preferences = await userService.updateUserPreferences(
    req.user._id,
    preferencesData,
  );
  res.status(200).json({ success: true, data: preferences });
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
  getUserById,
  updateUserRole,
  deactivateUser,
  activateUser,
  getPreferences,
  updatePreferences,
};
