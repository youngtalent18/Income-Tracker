import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    product: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "GHS",
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed", "refunded"],
      default: "completed",
    },
    category: {
      type: String,
      enum: ["MTN", "AT", "Telecel"],
      default: "MTN",
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

export default model("Transaction", transactionSchema);
