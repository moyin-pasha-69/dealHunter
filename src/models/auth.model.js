import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    immutable: [true, "you can't change  this value"],
    select: false,
  },
  firstName: {
    type: String,
    trim: true,
    validate: {
      validator: validator.isAlpha({ VALUE }),
      message: "Name must be contain alphabets",
    },
    required: [true, "first name is required"],
    minLength: [3, "First name must be more than 3 characters"],
    maxLength: [15, "First name not exceed more than 15"],
  },
  lastName: {
    type: String,
    trim: true,
    validate: {
      validator: validator.isAlpha({ VALUE }),
      message: "Name must be contain alphabets",
    },
    minLength: [3, "Last name must be more than 3 characters"],
    maxLength: [15, "Last name not exceed more than 15"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    validate: {
      validator: validator.isEmail({ VALUE }),
      message: "email id is invalid",
    },
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
});

const userModel = mongoose.model("Users", userSchema);

export default userModel;
