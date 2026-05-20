import { Router } from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { rateLimit } from "../middleware/rateLimit.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyPrefix: "auth",
  message: "Too many auth attempts. Please wait and try again.",
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", protect, me);
router.post("/logout", protect, logout);

export default router;
