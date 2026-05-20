import mongoose from "mongoose";

const { Schema, model } = mongoose;

const milestoneSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    target: {
      type: Number,
      required: true,
      min: 0,
    },
    current: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["on-track", "at-risk", "achieved", "completed", "failed", "missed"],
      default: "on-track",
    },
    dueDate: Date,
  },
  {
    timestamps: true,
  }
);

export default model("Milestone", milestoneSchema);
