import express from "express";
import connectDB from "./config/database.js";
import config from "./config/config.js";
import logger from "./middlewares/logger.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRoute from "./routers/authRoute.js";
import recipeRoute from "./routers/recipeRoute.js";
import categoryRoute from "./routers/categoryRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import multer from "multer";
import auth from "./middlewares/auth.js";
const app = express();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});
connectDB();
connectCloudinary();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger);

// Auth
app.use("/api/auth", authRoute);

// Recipe
app.use("/api/recipe", auth, upload.single("image"),  recipeRoute);

//Category
app.use("/api/category", auth, upload.single("image"), categoryRoute);

app.listen(config.port, () => {
  console.log(`Server running at port: ${config.port}....`);
});
