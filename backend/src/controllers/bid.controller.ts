import { NextFunction, Request, Response } from "express";
import { BidService } from "../services/bid.service";

export const submitBid = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { gigId, message, price } = req.body;
  
      const createdBid = await BidService.createBid({
          gigId: gigId as string,
          freelancerId: req.user?._id?.toString() as string,
          message: message,
          price: price
      });
  
      return res.status(200).json({
        success: true,
        message: "bid submitted successfully",
        data: createdBid,
      });
    } catch (error: any) {
      console.error("Error in bid submmit controller", error);
      return res.status(500).json({
        success: false,
        message: "Server Error in submitting bid",
      });
    }
  };

export const bidDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { gigId } = req.params;

    const bids = await BidService.getBids({
        gigId: gigId as string,
        ownerId: req.user?._id?.toString() as string
    });

    return res.status(200).json({
      success: true,
      message: "bids are found successfully",
      data: bids,
    });
  } catch (error: any) {
    console.error("Error in bid details controller", error);
    return res.status(500).json({
      success: false,
      message: "Server Error in fetching bid",
    });
  }
};

export const hireBid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        const { bidId } = req.params;
        const ownerId = req.user?._id?.toString() as string;
      
        const hiredBid = await BidService.getHiredBid({
          ownerId: ownerId,
          bidId: bidId as string
        });
    
        return res.status(201).json({
          success: true,
          message: "Bid hired successfully",
          data: hiredBid,
        });
      } catch (error: any) {
        console.error("Error in hired bid controller", error);
    
        return res.status(error.statusCode || 500).json({
          success: false,
          message: error.message || "Server Error in hiring bid",
        });
      }
};
