import jwt from "jsonwebtoken";
import ApiError from "../lib/apiError.js";
import User from "../models/User.js";

export async function protect(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const bearerToken = header.startsWith("Bearer ") ? header.slice(7) : null;
    const token = bearerToken || req.cookies?.token;

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.status ? error : new ApiError(401, "Invalid or expired token"));
  }
}

export function requireAdmin(req, _res, next) {
  if (req.user?.role !== "admin") {
    return next(new ApiError(403, "Admin access required"));
  }

  next();
}

export default {
  protect,
  requireAdmin,
};
