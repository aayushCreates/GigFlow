import mongoose from "mongoose";
import { Gig } from "../types/gig.types";

const gigSchema = new mongoose.Schema<Gig>(
  {
    title: {
        type: String,
        minLength: [3, "Title Input having atleast 3 characters"],
        maxLength: [50, "Title Input having atMost 50 characters"],
        required: true
    },
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    description: {
        type: String
    },
    budget: {
        type: Number,
        min: 0,
        required: true
    },
    status: {
      type: String,
      enum: ["open", "assigned"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const gigModel = mongoose.model<Gig>("Gig", gigSchema);

export default gigModel;
