import mongoose from "mongoose";
import bid from "../models/bid.model";
import gig from "../models/gig.model";
import { GigStatus } from "../types/gig.types";
import { BidStatus } from "../types/bid.types";
import { getIO } from "../socket";

export class BidService {
  static async createBid(data: {
    gigId: string;
    freelancer: string;
    message: string;
    price: number;
  }) {
    const gigDetails = await gig.findById(data.gigId);
    if (!gigDetails) {
      throw new Error("Gig not found");
    }

    const existingBid = await bid.findOne({
      gigId: data.gigId,
      freelancer: data.freelancer,
    });

    if (existingBid) {
      throw {
        statusCode: 400,
        message: "You have already placed a bid on this gig",
      };
    }

    const createdBid = await bid.create({
      gigId: data.gigId,
      freelancer: data.freelancer,
      message: data.message,
      price: data.price,
      status: BidStatus.pending,
    });

    await gig.findByIdAndUpdate(data.gigId, {
      $push: { bids: createdBid._id },
    });

    return createdBid;
  }

  static async getBids(data: { gigId: string; userId: string }) {
    const gigDetails = await gig
      .findById(data.gigId)
      .populate("owner", "name email");
    if (!gigDetails) {
      throw new Error("Gig not found");
    }

    const isOwner = gigDetails.owner._id.toString() === data.userId;

    let bids;
    if (isOwner) {
      bids = await bid
        .find({ gigId: data.gigId })
        .populate("freelancer", "name email")
        .sort({ createdAt: -1 });
    } else {
      bids = await bid
        .find({ gigId: data.gigId, freelancer: data.userId })
        .populate("freelancer", "name email")
        .sort({ createdAt: -1 });
    }

    return {
      title: gigDetails.title,
      budget: gigDetails.budget,
      description: gigDetails.description,
      status: gigDetails.status,
      owner: gigDetails.owner,
      ownerId: gigDetails.owner._id,
      bids,
    };
  }

  static async getHiredBid(data: { owner: string; bidId: string }) {
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
          owner: data.owner,
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

      const io = getIO();
      io.to(bidDetails.freelancer.toString()).emit("gig:hired", {
        message: `You have been hired for "${assignedGig.title}"`,
        gigId: assignedGig._id,
        bidId: bidDetails._id,
      });

      return bidDetails;
    } catch (err){
      console.log("Error in the hire bid");
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
