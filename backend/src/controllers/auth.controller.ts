import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter the required fields",
      });
    }
    
    const newUser = await authService.registerUser({
      name,
      email,
      password,
    });
    if (!newUser) {
      console.log("Error in user registeration service");
      return res.status(500).json({
        success: false,
        message: "Server Error in registeration of user, please try again",
      });
    }

    console.log("user: ", newUser);

    res.cookie("token", newUser?.token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: newUser.user._id,
        name: name,
        email: email,
      },
      token: newUser.token,
    });
  } catch (err: any) {
    console.error("Error in the register user controller:", err);
    
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val: any) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server Error in registration of user, please try again",
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter the required fields",
      });
    }

    const existedUser = await authService.loginUser({
      email,
      password,
    });
    res.cookie("token", existedUser.token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        _id: existedUser.user._id,
        name: existedUser.user.name,
        email: email,
      },
      token: existedUser.token,
    });
  } catch (err: any) {
    console.error("Error in the login user controller:", err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server Error in logging in user, please try again",
    });
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("token", cookieOptions);

    res.status(200).json({
      success: true,
      message: "User loggedout successfully",
    });
  } catch (err) {
    console.log("Error in the logout user controller");
    return res.status(500).json({
      success: false,
      message: "Server Error in loggedout user, please try again",
    });
  }
};
