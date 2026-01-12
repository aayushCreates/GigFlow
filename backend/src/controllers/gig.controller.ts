import { NextFunction, Request, Response } from "express";
import { GigService } from "../services/gig.service";

export const allGigs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gigs = await GigService.getAllGigs();

    return res.status(200).json({
      success: true,
      message: "Gigs are found successfully",
      data: gigs,
    });
  } catch (error: any) {
    console.error("Error in allGigs controller", error);

    return res.status(500).json({
      success: false,
      message: "Server Error in fetching gigs",
    });
  }
};

export const createGig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        if (!req.user || !req.user._id) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized User",
          });
        }
    
        const gig = await GigService.createGig({
          ...req.body,
          ownerId: req.user._id,
        });
    
        return res.status(201).json({
          success: true,
          message: "Gig created successfully",
          data: gig,
        });
      } catch (error: any) {
        console.error("Error in createGig controller", error);
    
        return res.status(error.statusCode || 500).json({
          success: false,
          message: error.message || "Server Error in creating gig",
        });
      }
};
