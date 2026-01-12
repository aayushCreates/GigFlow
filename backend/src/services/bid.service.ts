import mongoose from "mongoose";
import bid from "../models/bid.model";
import gig from "../models/gig.model";
import { GigStatus } from "../types/gig.types";
import { BidStatus } from "../types/bid.types";

export class BidService {
  static async createBid(data: {
    gigId: string;
    freelancerId: string;
    message: string;
    price: number;
  }) {
    const gigDetails = await gig.findById(data.gigId);
    if(!gigDetails) {
      throw new Error("Gig not found");
    }

    const createdBid = await bid.create({
      gigId: data.gigId,
      freelancerId: data.freelancerId,
      message: data.message,
      price: data.price,
      status: BidStatus.pending
    });

    return createdBid;
  }

  static async getBids(data: { gigId: string; ownerId: string }) {
    const gigDetails = await gig
      .findById(data.gigId)
      .populate("ownerId", "name email");
    if (!gigDetails) {
      throw new Error("Gig not found");
    }

    if (gigDetails.ownerId._id.toString() !== data.ownerId) {
      throw new Error("Unauthorized access");
    }

    const bids = await bid
      .find({ gigId: data.gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    return {
      title: gigDetails.title,
      budget: gigDetails.budget,
      description: gigDetails.description,
      status: gigDetails.status,
      owner: gigDetails.ownerId,
      bids,
    };
  }

  static async getHiredBid(data: { ownerId: string; bidId: string }) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const bidDetails = await bid.findById(data.bidId).session(session);
      if (!bidDetails) {
        throw new Error("Bid not found");
      }

      const assignedGig = await gig.findOneAndUpdate(
        {
          _id: bidDetails.gigId,
          ownerId: data.ownerId,
          status: GigStatus.open,
        },
        { status: GigStatus.assigned },
        { new: true, session }
      );
      if (!assignedGig) {
        throw new Error("Gig already assigned or unauthorized");
      }

      await bid.updateMany(
        { gigId: assignedGig._id },
        { status: BidStatus.rejected },
        { session }
      );

      bidDetails.status = BidStatus.hired;
      await bidDetails.save({ session });

      await session.commitTransaction();
      return bidDetails;
    } catch {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
