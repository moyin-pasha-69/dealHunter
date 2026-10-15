import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    //which user's item is
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //product id
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    targetPrice: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => v > 0,
        message: "Target price must be greater than zero",
      },
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["active", "paused", "unavailable", "error"],
        message: "{VALUE} not valid",
      },
      default: "active",
    },
    lastCheckedAt: {
      type: Date,
    },
    lastSuccessfulCheckAt: {
      type: Date,
    },
    lastKnownPrice: {
      type: Number,
    },
    notificationSettings: {
      type: {
        email: {
          type: Boolean,
          default: true,
        },
      },
      default: () => ({}),
    },
  },
  { timestamps: true },
);

const itemModel = mongoose.model("TrackingItem", itemSchema);

export default itemModel;
