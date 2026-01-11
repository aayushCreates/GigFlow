import mongoose from "mongoose";
import { User } from "../types/user.types";

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true,
    minLength: [4, "Name Input having atleast 4 characters"],
    maxLength: [50, "Name Input having atMost 50 characters"]
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password Input having atleast 8 characters"],
    maxLength: [12, "Password Input having atmost 12 characters"]
  }
}, {
    timestamps: true
});

const userModel = mongoose.model<User>("User", userSchema);

export default userModel;