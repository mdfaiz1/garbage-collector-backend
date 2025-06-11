import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// access and refresh token
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

export const registerUser = async (req, res) => {
  try {
    console.log(req.body);
    // return [];

    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // Create new user
    const newUser = await User.create({ fullName, email, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Check password
    const isPasswordValid = await user.isPasswordValid(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    // Get logged in user details without sensitive fields
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set secure cookies
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict", // Consider adding this for CSRF protection
    };

    // Send response
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "User logged in successfully",
        user: loggedInUser,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Remove refresh token from DB
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    // Clear cookies
    res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .status(200)
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
