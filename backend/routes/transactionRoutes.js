import { Router } from "express";
import {  createTransaction, deleteTransaction, listTransactions, updateTransaction,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.route("/").get(listTransactions).post(createTransaction);
router.route("/:id").patch(updateTransaction).delete(deleteTransaction);

export default router;
