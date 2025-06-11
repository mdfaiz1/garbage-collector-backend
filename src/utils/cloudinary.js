import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been successful uploaded
    // console.log("file path URL", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove locally saved temparay file whose failed  in uploading
    return null;
  }
};

export { uploadCloudinary };
