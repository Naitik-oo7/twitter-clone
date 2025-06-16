import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "You need to login first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorised : Invalid token" });
    }
    const user = await User.findById(decoded.userId).select("-password");

    req.user = user;
    next();
  } catch (error) {
    console.log("Error  in protectedRoute middleware", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
