import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    //company name
    provider: {
      type: String,
      trim: true,
      required: [true, "provider is required"],
    },
    //name as i prefer
    title: {
      type: String,
      trim: true,
      required: [true, "title is required"],
    },
    //product url or link
    productUrl: {
      type: String,
      trim: true,
      required: [true, "product URL is required"],
    },
    category: {
      type: String,
    },
  },
  { timestamps: true },
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
