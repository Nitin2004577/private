import dotenv from "dotenv";

dotenv.config();

const config = {
  mongoDBUrl: process.env.MONGODB_URL || "",
  port: process.env.PORT || "5000",
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  gemini:{
    apiKey: process.env.GEMINI_API_KEY || "",
    apiUrl: process.env.GEMINI_API_URL || "",
  }
};

export default config;
