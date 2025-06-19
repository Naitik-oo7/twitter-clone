import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToFollow = await User.findById(id);
    const user = await User.findById(req.user._id);

    if (!userToFollow || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    // internally handles both types safely and cleanly without toString(), because the id in the params is a string and the req.user._id is an mongoose object_id
    if (id === req.user._id.equals(id)) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }
    const isFollowing = user.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "user unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      const newNotification = new Notification({
        type: "follow",
        from: user._id,
        to: userToFollow._id,
      });
      await newNotification.save();
      //TODO : return the id of the user  as a response
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in getUserProfile controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      { $match: { _id: { $ne: userId } } },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );

    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json({ suggestedUsers });
  } catch (error) {
    console.log("Error in getSuggestedUsers controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      username,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body;
    let { profileImg, coverImg } = req.body;
    const userId = req.user._id;
    let user = await User.findById(userId);
    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res
        .status(400)
        .json({ message: "Please provide both the passwords" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Password" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be of minimum 6 characters" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (profileImg) {
      if (user.profileImg) {
        // If the user already has a profile image, delete it from Cloudinary
        const publicId = user.profileImg.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }
    if (coverImg) {
      if (user.coverImg) {
        // If the user already has a cover image, delete it from Cloudinary
        const publicId = user.coverImg.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    await user.save();

    user.password = null; // Remove password from the response

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.log("Error in updateUser controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
