import mongoose from "mongoose";
import { Bid, BidStatus } from "../types/bid.types";

const bidSchema = new mongoose.Schema<Bid>(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
      index: true
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    message: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BidStatus),
      default: BidStatus.pending,
    },
  },
  {
    timestamps: true,
  }
);

bidSchema.index({ gigId: 1, freelancer: 1 }, { unique: true });

const bid = mongoose.model<Bid>("Bid", bidSchema);

export default bid;
