import mongoose from "mongoose";
import { Gig, GigStatus } from "../types/gig.types";

const gigSchema = new mongoose.Schema<Gig>(
  {
    title: {
      type: String,
      minLength: [3, "Title Input having atleast 3 characters"],
      maxLength: [50, "Title Input having atMost 50 characters"],
      required: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    budget: {
      type: Number,
      min: 0,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(GigStatus),
      default: GigStatus.open,
    }
  },
  {
    timestamps: true,
  }
);

const gig = mongoose.model<Gig>("Gig", gigSchema);

export default gig;
