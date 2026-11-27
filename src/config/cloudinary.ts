import { v2 as cloudinary } from "cloudinary";
import env from "../env.js";

cloudinary.config({
  cloud_name: "glvoqumd",
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret, 
});


export default cloudinary;