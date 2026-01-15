import mongoose from "mongoose";
import { User } from "../types/user.types";

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
      minLength: [4, "Name Input having atleast 4 characters"],
      maxLength: [50, "Name Input having atMost 50 characters"],
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model<User>("User", userSchema);
export default user;
