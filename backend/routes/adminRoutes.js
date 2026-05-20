import { Router } from "express";
import { getAdminOverview } from "../controllers/adminController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(protect, requireAdmin);

router.get("/overview", getAdminOverview);

export default router;
