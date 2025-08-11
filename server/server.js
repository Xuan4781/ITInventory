import { config } from "dotenv";
config({ path: "./config/config.env" });

console.log("✅ NODE_ENV:", process.env.NODE_ENV); // ← Add this

import { app } from "./app.js";
import { v2 as cloudinary } from "cloudinary";

console.log("Cloudinary env vars:", {
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET ? "***" : undefined,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port ${process.env.PORT}`);
});
