import mongoose from "mongoose";
import { ADMIN, USER } from "../constants/role.js";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, "Full Name is required!"] },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: [true, "Email already used."],
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      },
      message: "Invalid email address",
    },
  },
  password: {
    type: String,
    required: true,
    required: [true, "Password is required!"],
    minLength: [6, "Password length must be greater than 6."],
  },
  role: {
    type: [String],
    default: [USER],
    enum: [USER, ADMIN],
  },
  profileImage: String,
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
