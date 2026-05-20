import { Router } from "express";
import { createCustomer, deleteCustomer, listCustomers, updateCustomer } from "../controllers/customerController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.route("/").get(listCustomers).post(createCustomer);
router.route("/:id").patch(updateCustomer).delete(deleteCustomer);

export default router;
