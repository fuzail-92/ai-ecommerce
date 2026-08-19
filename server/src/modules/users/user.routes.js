const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/authorize.middleware");

// Protected route: get current user profile (basic)
router.get("/me", authMiddleware.protect, userController.getMe);

// Admin-only route: get all users
router.get(
  "/",
  authMiddleware.protect,
  authorize("admin"),
  userController.getAllUsers,
);

// Protected route: get detailed profile
router.get("/profile", authMiddleware.protect, userController.getProfile);

// Protected route: update profile
router.put("/profile", authMiddleware.protect, userController.updateProfile);

// User preferences
router.get(
  "/preferences",
  authMiddleware.protect,
  userController.getPreferences,
);
router.put(
  "/preferences",
  authMiddleware.protect,
  userController.updatePreferences,
);

// Protected route: change password
router.put(
  "/change-password",
  authMiddleware.protect,
  userController.changePassword,
);

// Address routes
router.post("/addresses", authMiddleware.protect, userController.addAddress);

router.put(
  "/addresses/:addressId",
  authMiddleware.protect,
  userController.updateAddress,
);

router.delete(
  "/addresses/:addressId",
  authMiddleware.protect,
  userController.deleteAddress,
);

// Admin: Get user by ID
router.get(
  "/:userId",
  authMiddleware.protect,
  authorize("admin"),
  userController.getUserById,
);

// Admin: Update user role
router.patch(
  "/:userId/role",
  authMiddleware.protect,
  authorize("admin"),
  userController.updateUserRole,
);

// Admin: Deactivate user
router.patch(
  "/:userId/deactivate",
  authMiddleware.protect,
  authorize("admin"),
  userController.deactivateUser,
);

// Admin: Activate user
router.patch(
  "/:userId/activate",
  authMiddleware.protect,
  authorize("admin"),
  userController.activateUser,
);

module.exports = router;
