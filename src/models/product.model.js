import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      trim: true,
      required: true,
    },
    providerProductId: {
      type: String,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    productUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: String,
    },
    variant: {
      type: String,
    },
  },
  { timestamps: true },
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
