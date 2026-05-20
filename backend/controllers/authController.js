import ApiError from "../lib/apiError.js";
import asyncHandler from "../lib/asyncHandler.js";
import { clearAuthCookie, setAuthCookie, signToken } from "../lib/tokens.js";
import User from "../models/User.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  const exists = await User.findOne({ email: email.toLowerCase().trim() });

  if (exists) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = signToken(user);
  setAuthCookie(res, token);

  res.status(201).json({
    user,
    token,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user);
  setAuthCookie(res, token);

  res.json({
    user,
    token,
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({
    user: req.user,
  });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  res.json({
    message: "Logged out",
  });
});

export default {
  register,
  login,
  me,
  logout,
};
