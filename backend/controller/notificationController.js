import Notification from "../models/notificationModel.js";

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      to: req.user._id,
    }).populate({ path: "from", select: "username profileImg" });

    await Notification.updateMany({ to: req.user._id }, { read: true });

    res.status(200).json({ notifications });
  } catch (error) {
    console.log("Error in getAllNotifications controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ to: req.user._id });
    res.status(200).json({ message: "notifications deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAllNotifications controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
