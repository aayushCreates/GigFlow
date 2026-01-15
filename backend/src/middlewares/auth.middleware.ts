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

    const decodedObj = jwt.verify(token, jwtSecret);

    const { id } = decodedObj as JwtPayload;

    const userDetails = await user.findById(id);
    if (!userDetails) {
      throw new Error("User not found");
    }

    req.user = userDetails;
    next();
  } catch (err: any) {
    console.error("Auth Middleware Error:", err);
    res.status(400).json({
      message: err.message || "Authentication Error",
    });
  }
};

export default isUserLoggedIn;
