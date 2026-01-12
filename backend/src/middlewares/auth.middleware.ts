import { Request, NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import user from "../models/user.model";

const isUserLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }

    const jwtSecret = process.env.JWT_SECRET as string;

    const decodedObj = await jwt.verify(token, jwtSecret);

    const { _id } = decodedObj as JwtPayload;

    const userDetails = await user.findById(_id);
    if (!userDetails) {
      throw new Error("User not found");
    }

    req.user = userDetails;
    next();
  } catch (err) {
    res.status(400).json({
      message: "Err",
    });
  }
};

export default isUserLoggedIn;
