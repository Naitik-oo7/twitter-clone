import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
} from "../controller/userController.js";
const router = express.Router();
router.use(protectRoute);

router.get("/profile/:username", getUserProfile);
router.post("/follow/:id", followUnfollowUser);
router.get("/suggestedUser", getSuggestedUsers);
router.post("/update", updateUser);
export default router;
