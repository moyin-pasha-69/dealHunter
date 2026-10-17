import userModel from "../models/auth.model.js";
import bcrypt from "bcrypt";
import * as helpUtils from "../utils/helpFull.utils.js";
import jsonwebtoken from "jsonwebtoken";
import ApiError from "../utils/api-error.utils.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.utils.js";

const userRegister = asyncErrorHandler(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;
  if (!password) {
    return next(new ApiError("Password is required", 400));
  }
  const username = helpUtils.getUserName(firstname, lastname);
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    firstName: firstname,
    lastName: lastname,
    email,
    password: hash,
  });
  const token = await jsonwebtoken.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  return res.status(201).json({
    message: "user registered successfully!",
    user: {
      username: user.username,
      fullname: `${user.firstName} ${user.lastName || ""}`,
      email: user.email,
    },
  });
});
const loginUser = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  const token = await jsonwebtoken.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  return res.status(200).json({
    status: "success",
    message: "user logged successfully",
    data: {
      username: user.username,
      fullname: `${user.firstName} ${user.lastName || ""}`,
      email: user.email,
    },
  });
});

export { userRegister, loginUser };
