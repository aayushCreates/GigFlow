import user from "../models/user.model";
import { getJWT, getPasswordHash, validatePassword } from "../utils/auth.utils";

export class authService {
  static async registerUser(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const userExists = await user.findOne({ email: data.email });
    if (userExists) {
      throw {
        statusCode: 400,
        message: "Already registered user",
      };
    }

    const hashedPassword = await getPasswordHash(data.password);

    const newUser = await user.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });
    console.log("new user: ", newUser);
    if (!newUser) {
      throw {
        statusCode: 500,
        message: "User registration failed",
      };
    }

    const token = await getJWT(newUser._id.toString(), newUser.email);

    return {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    };
  }

  static async loginUser(data: { email: string; password: string }) {
    const existedUser = await user.findOne({ email: data.email }).select("+password");
    if (!existedUser) {
      throw {
        statusCode: 400,
        message: "Invalid Credentials",
      };
    }

    const isValidPassword = await validatePassword(
      data.password,
      existedUser.password
    );
    if (!isValidPassword) {
      throw {
        statusCode: 400,
        message: "Invalid Credentials",
      };
    }

    const token = await getJWT(existedUser._id.toString(), existedUser.email);

    return {
      user: {
        _id: existedUser._id,
        name: existedUser.name,
        email: existedUser.email,
      },
      token,
    };
  }
}
