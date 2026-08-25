const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  },
);

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true, // one wishlist per user
    },
    products: {
      type: [wishlistItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
