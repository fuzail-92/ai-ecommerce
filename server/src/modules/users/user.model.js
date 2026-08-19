const mongoose = require("mongoose");

// Address subdocument schema
const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    street: {
      type: String,
      required: [true, "Street address is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },

    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true,
    },

    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  },
);

// User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    // User addresses
    addresses: {
      type: [addressSchema],
      default: [],
    },
    preferences: {
      language: {
        type: String,
        enum: ["en", "ur"],
        default: "en",
      },
      currency: {
        type: String,
        enum: ["PKR", "USD"],
        default: "PKR",
      },
      notifications: {
        orderUpdates: {
          type: Boolean,
          default: true,
        },
        promotions: {
          type: Boolean,
          default: false,
        },
        newsletter: {
          type: Boolean,
          default: false,
        },
      },
    },
  },

  {
    timestamps: true,
  },
);

// Create and export User model
const User = mongoose.model("User", userSchema);

module.exports = User;
