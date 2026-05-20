import ApiError from "../lib/apiError.js";
import asyncHandler from "../lib/asyncHandler.js";
import Milestone from "../models/Milestone.js";

export const listMilestones = asyncHandler(async (req, res) => {
  const milestones = await Milestone.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json({ milestones });
});

export const createMilestone = asyncHandler(async (req, res) => {
  if (!req.body.title || req.body.target === undefined) {
    throw new ApiError(400, "Title and target are required");
  }

  const milestone = await Milestone.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json({ milestone });
});

export const updateMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.findOneAndUpdate(
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

  if (!milestone) throw new ApiError(404, "Milestone not found");

  res.json({ milestone });
});

export const deleteMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!milestone) throw new ApiError(404, "Milestone not found");

  res.json({ message: "Milestone deleted" });
});

export default {
  listMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
};
