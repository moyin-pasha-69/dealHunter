import userModel from "../models/auth.model.js";
import ApiError from "../utils/api-error.utils.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.utils.js";
import bcrypt from "bcrypt";

const isUserRegistered = asyncErrorHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username && !email) {
    return next(new ApiError("email or username is required", 400));
  }
  if (!password) {
    return next(new ApiError("password is required", 400));
  }

  let user;
  if (username) {
    user = await userModel
      .findOne({ username: username.trim().toLowerCase() })
      .select("+password");
  } else if (email) {
    user = await userModel
      .findOne({ email: email.trim().toLowerCase() })
      .select("+password");
  }
  if (!user) {
    return next(new ApiError("Invalid username / email or password", 401));
  }
  const verifyPass = await bcrypt.compare(password, user.password);
  if (!verifyPass) {
    return next(new ApiError("Invalid username / email or password", 401));
  }
  req.user = user;
  next();
});

export { isUserRegistered };
