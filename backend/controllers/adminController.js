import asyncHandler from "../lib/asyncHandler.js";
import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getAdminOverview = asyncHandler(async (_req, res) => {
  const [
    totalUsers,
    totalCustomers,
    totalTransactions,
    totals,
    transactions,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments(),
    Customer.countDocuments(),
    Transaction.countDocuments(),
    Transaction.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0],
            },
          },
        },
      },
    ]),
    Transaction.find().sort({ date: -1, createdAt: -1 }).limit(100),
    User.find().sort({ createdAt: -1 }).limit(5).select("-password"),
  ]);

  const statusCounts = totals.reduce((counts, total) => {
    counts[total._id] = total.count;
    return counts;
  }, {});

  const totalRevenue = totals.reduce((sum, total) => sum + Number(total.revenue || 0), 0);
  const completedCount = statusCounts.completed || 0;
  const completionRate = totalTransactions
    ? Number(((completedCount / totalTransactions) * 100).toFixed(1))
    : 0;

  res.json({
    stats: {
      totalUsers,
      totalCustomers,
      totalTransactions,
      totalRevenue,
      completionRate,
      pendingCount: statusCounts.pending || 0,
      failedCount: statusCounts.failed || 0,
    },
    recentTransactions: transactions.slice(0, 10),
    recentUsers,
  });
});

export default {
  getAdminOverview,
};
