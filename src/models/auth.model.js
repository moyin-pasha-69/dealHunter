import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      immutable: true,
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, "first name is required"],
      minLength: [3, "First name must be more than 3 characters"],
      maxLength: [15, "First name not exceed more than 15"],
    },
    lastName: {
      type: String,
      trim: true,
      validate: {
        validator: validator.isAlpha,
        message: "Name must be contain alphabets",
      },
      minLength: [3, "Last name must be more than 3 characters"],
      maxLength: [15, "Last name not exceed more than 15"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "email id is invalid",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
      select: false,
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
