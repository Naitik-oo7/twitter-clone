import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  deleteAllNotifications,
  getAllNotifications,
} from "../controller/notificationController.js";
const router = express.Router();

router.use(protectRoute);
router.get("/", getAllNotifications);
router.delete("/", deleteAllNotifications);
export default router;
