import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    uerId: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      required: true,
    },
    targetPrice: {
      type: number,
      validate: {
        required: true,
        validator: () => {
          return { VALUE } > 0;
        },
        message: "must be greater than Zero",
      },
    },
    currency: {
      type: string,
      required: true,
      default: INR,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["active", "paused", "unavailable", "error"],
        message: "{VALUE} not valid",
      },
    },
    lastCheckedAt: {
      type: date,
    },
    lastSuccessfulCheckAt: {
      type: date,
    },
    lastKnownPrice: {
      type: date,
    },
    notificationSettings: {
      type: String,
    },
  },
  { timestamp: true },
);

const itemModel = mongoose.model("TrackingItem", itemSchema);

export default itemModel;
