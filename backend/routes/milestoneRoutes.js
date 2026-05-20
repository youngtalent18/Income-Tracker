import { Router } from "express";
import { createMilestone, deleteMilestone, listMilestones, updateMilestone } from "../controllers/milestoneController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.route("/").get(listMilestones).post(createMilestone);
router.route("/:id").patch(updateMilestone).delete(deleteMilestone);

export default router;
