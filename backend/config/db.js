import mongoose from "mongoose";
import User from "../models/User.js";

async function seedAdminUser() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log(`Admin role granted to ${normalizedEmail}`);
    }

    return;
  }

  await User.create({
    name: name || "Admin",
    email: normalizedEmail,
    password,
    role: "admin",
  });

  console.log(`Admin user created: ${normalizedEmail}`);
}

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.warn("MONGODB_URI is not set. API will start without MongoDB.");
    return null;
  }

  mongoose.set("strictQuery", true);

  const connection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log(`MongoDB connected: ${connection.connection.host}`);
  await seedAdminUser();
  return connection;
}

export default connectDB;
