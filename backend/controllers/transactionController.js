import ApiError from "../lib/apiError.js";
import asyncHandler from "../lib/asyncHandler.js";
import Transaction from "../models/Transaction.js";

const CATEGORY_ALIASES = {
  mtn: "MTN",
  at: "AT",
  airteltigo: "AT",
  airtel: "AT",
  tigo: "AT",
  telecel: "Telecel",
};

const normalizeCategory = (category) => {
  const value = String(category || "").trim().toLowerCase().replace(/\s+/g, "");
  return CATEGORY_ALIASES[value] || "MTN";
};

export const listTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({
    date: -1,
    createdAt: -1,
  });

  res.json({ transactions });
});

export const createTransaction = asyncHandler(async (req, res) => {
  const { customerName, product, amount } = req.body;

  if (!customerName || !product || amount === undefined) {
    throw new ApiError(400, "Customer name, product, and amount are required");
  }

  const transaction = await Transaction.create({
    ...req.body,
    category: normalizeCategory(req.body.category),
    user: req.user._id,
  });

  res.status(201).json({ transaction });
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    {
      ...req.body,
      ...(Object.hasOwn(req.body, "category")
        ? { category: normalizeCategory(req.body.category) }
        : {}),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  res.json({ transaction });
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  res.json({ message: "Transaction deleted" });
});

export default {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
