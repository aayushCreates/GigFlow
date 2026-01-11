import mongoose from "mongoose";
import { Bid } from "../types/bid.types";

const bidSchema = new mongoose.Schema<Bid>(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "hired", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const bidModel = mongoose.model<Bid>("Bid", bidSchema);

export default bidModel;
