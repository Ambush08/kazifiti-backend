import fs from "fs";
import multer from "multer";
import crypto from "crypto";
import path from 'path';
import { AppError } from "../errors/AppError.js";

const uploadsDir = "temp/uploads";

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(16, function (err, raw) {
      if (err) return cb(err, "");
      const fileExt = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${raw.toString("hex")}${fileExt}`);
    });
  },
});

const createUpload = (allowed: string[], errorMessage: string) =>
  multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      console.log("upload:", file.mimetype, file.originalname);
      
      if (allowed.includes(file.mimetype)) cb(null, true);
      else cb(new AppError(400, errorMessage));
    },
  });


  export const uploadLogo = createUpload(
    ["image/jpeg", "image/png", "image/webp"],
  "Only JPEG, PNG, or WebP images are allowed",
  );



  export const uploadDocs = createUpload(
    [
    "application/pdf",
    "application/msword",
  ],
  "Only PDF and Word documents are allowed",
  )
