import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRouter.js";

dotenv.config();
import { connectMongoDB } from "./db/connectMongoDB.js";
connectMongoDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key : process.env.ClOUDINARY_API_KEY,
  api_secret : process.env.ClOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //to parse form data url encoded
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
