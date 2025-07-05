import path from "path";
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
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" })); //to parse form data url encoded
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/notifications", notificationRouter);

console.log("Dumping all registered route paths:");
app._router.stack.forEach(layer => {
  if (layer.route) {
    console.log("Route path:", layer.route.path);
  } else if (layer.name === "router") {
    console.log("Router middleware regexp:", layer.regexp);
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
