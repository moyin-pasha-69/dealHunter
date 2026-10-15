import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    //company name
    provider: {
      type: String,
      trim: true,
      required: true,
    },
    //name as i prefer
    title: {
      type: String,
      trim: true,
      required: true,
    },
    //product url or link
    productUrl: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: String,
    },
  },
  { timestamps: true },
);

const productModel = mongoose.model("Products", productSchema);

export default productModel;
