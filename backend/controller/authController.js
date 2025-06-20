import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/lib/generateToken.js";

export const suignup = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    if (!username || !email || !password || !fullName) {
      return res.json("all fields required");
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser.username) {
      if (existingUser.username) {
        return res.json({ message: "Username already exists" });
      }
      if (existingUser.email) {
        return res.json({ message: "email already exists" });
      }
    }

    const hashP = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      fullName,
      password: hashP,
    });
    await user.save();

    const cookie = generateTokenAndSetCookie(userId, res);
    res.json(cookie, "sign up done");
  } catch (error) {}
};

export const signup = async (req, res) => {
  try {
    const { username, fullName, password, email } = req.body;
    //Input Validation
    if (!username || !fullName || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //Checking if the username or email already exists in the DB
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    //This code queries the database for two times - simpler but puts extra load on the DB
    // const existingUsername = await User.findOne({ username });
    // if (existingUsername) {
    //   return res.status(400).json({ message: "Username already exists" });
    // }
    // const existingEmail = await User.findOne({ email });
    // if (existingEmail) {
    //   return res.status(400).json({ message: "Email already exists" });
    // }

    //Hash the  password, with salt(random string gets added before the hashed string) - so that if your data gets leaked the password cannot be found in plain text
    const hashedPass = await bcrypt.hash(password, 10);

    //Create and save new user
    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPass,
    });
    await newUser.save();

    //Generate token and set cookie - Here we are passing the newUser Id which would be the payload for the jwt and later when we deocde the jwt we would be fetching the whole user from the DB using the findById(), and sending a cookie in return
    generateTokenAndSetCookie(newUser._id, res);

    //Returning success response
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
    });
  } catch (error) {
    console.log("Error in the signup controller", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      bio: user.bio,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out successfully" });
  } catch (error) {
    console.log("Error in Logout controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Erro in getMe controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
