import express from "express";
import userRouter from "./routes/authRoutes.js";
import dotenv from "dotenv";
import { connectMongoDB } from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

connectMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //to parse form data url encoded
app.use(cookieParser());
app.use("/api/auth", userRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
