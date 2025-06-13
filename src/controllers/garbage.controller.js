import { Garbage } from "../models/garbage.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

export const createGarbage = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    // Get user ID from JWT middleware
    const userId = req.user?._id;

    // Extract images from Multer
    const files = req.files?.images || [];
    const images = files.map((file) => file.path); // or `file.filename` if not using full path
    // If using Cloudinary, you can upload images like this:
    const uploadedImages = [];
    for (const file of files) {
      const uploadedImage = await uploadCloudinary(file.path);
      if (uploadedImage) {
        uploadedImages.push(uploadedImage.secure_url); // Use secure_url for HTTPS
      }
    }

    // Validate inputs
    if (!title || !description || images.length === 0 || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;

    const newGarbage = await Garbage.create({
      title,
      description,
      images: uploadedImages.length > 0 ? uploadedImages : images, // Use Cloudinary images if available
      location: parsedLocation,
      user: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Garbage created successfully",
      garbage: newGarbage,
    });
  } catch (error) {
    console.error("Error creating garbage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllGarbage = async (req, res) => {
  try {
    const garbageList = await Garbage.find()
      .populate("user", "fullName email") // Populate user details
      .sort({ createdAt: -1 }); // Sort by creation date
    if (garbageList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No garbage entries found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Garbage entries retrieved successfully",
      garbage: garbageList,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getGarbageById = async (req, res) => {
  try {
    const { id } = req.params;
    const garbage = await Garbage.findById(id).populate(
      "user",
      "fullName email"
    );
    if (!garbage) {
      return res.status(404).json({
        success: false,
        message: "Garbage entry not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Garbage entry retrieved successfully",
      garbageData: garbage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateGarbage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location } = req.body;

    // Extract uploaded image filenames
    const files = req.files?.images || [];
    const images = files.map((file) => file.path); // or file.filename based on your multer setup

    // Validate input
    if (!title || !description || images.length === 0 || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Parse location if it's a stringified JSON from form-data
    const parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;

    // Update
    const updatedGarbage = await Garbage.findByIdAndUpdate(
      id,
      { title, description, images, location: parsedLocation },
      { new: true }
    ).populate("user", "fullName email");

    if (!updatedGarbage) {
      return res.status(404).json({
        success: false,
        message: "Garbage entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Garbage entry updated successfully",
      garbage: updatedGarbage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteGarbage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGarbage = await Garbage.findByIdAndDelete(id);
    if (!deletedGarbage) {
      return res.status(404).json({
        success: false,
        message: "Garbage entry not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Garbage entry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
