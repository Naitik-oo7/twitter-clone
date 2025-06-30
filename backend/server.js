import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";

dotenv.config();
import { connectMongoDB } from "./db/connectMongoDB.js";
connectMongoDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.ClOUDINARY_API_KEY,
  api_secret: process.env.ClOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true , limit: "10mb"})); //to parse form data url encoded
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/notifications", notificationRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
