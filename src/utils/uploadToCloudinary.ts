import cloudinary from "../config/cloudinary.js";
import { AppError } from "../errors/AppError.js";

const uploadToCloudinary = async (filePath: string) => {
  try {
    const upoadResult = await cloudinary.uploader.upload(filePath, {
      folder: "company-logos",
      resource_type: "image",
      allowed_formats: ["png", "jpg", "jpeg", "webp"],
    });

    return {
      url: upoadResult.secure_url,
      publicId: upoadResult.public_id,
    };
  } catch (error) {
    throw new AppError(502, "Failed to upload logo to cloudinary", {
      cause: error,
    });
  }
};

export default uploadToCloudinary;
