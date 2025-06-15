import express from "express";
import userRouter from "./routes/authRoutes.js";
import dotenv from "dotenv";
import { connectMongoDB } from "./db/connectMongoDB.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

connectMongoDB();

app.use("/api/auth", userRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
