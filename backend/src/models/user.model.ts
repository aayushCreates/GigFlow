import mongoose from "mongoose";
import { User } from "../types/user.types";
import bcrypt from 'bcrypt';

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
      minLength: [8, "Password Input having atleast 8 characters"],
      maxLength: [12, "Password Input having atmost 12 characters"],
      trim: true,
      select: false
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const user = mongoose.model<User>("User", userSchema);
export default user;
