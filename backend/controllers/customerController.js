import ApiError from "../lib/apiError.js";
import asyncHandler from "../lib/asyncHandler.js";
import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";

export const listCustomers = asyncHandler(async (req, res) => {
  const savedCustomers = await Customer.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  const summaries = await Transaction.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: "$customerName",
        totalSpent: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0],
          },
        },
        transactionCount: { $sum: 1 },
        lastPurchase: { $max: "$date" },
      },
    },
    { $sort: { totalSpent: -1 } },
  ]);

  res.json({
    customers: savedCustomers,
    summaries,
  });
});

export const createCustomer = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    throw new ApiError(400, "Customer name is required");
  }

  const customer = await Customer.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json({ customer });
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!customer) throw new ApiError(404, "Customer not found");

  res.json({ customer });
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!customer) throw new ApiError(404, "Customer not found");

  res.json({ message: "Customer deleted" });
});

export default {
  listCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
