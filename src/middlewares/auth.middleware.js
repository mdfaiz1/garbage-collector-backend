import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyUserJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers["Authorization"]?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing",
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?.id).select(
      "-password -refreshToken"
    );
    // console.log("Token received:", decodedToken);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }
};
