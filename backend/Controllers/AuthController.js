// Controllers/AuthController.js
import UserModel from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER USER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are mandatory!" });
    }
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        message: "User already exists, you can login",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "Signup successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// LOGIN USER
//  // adjust path as neededimport UserModel from "../models/User.js";


// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for empty fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are mandatory!" });
    }

    // Find user in DB
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is not valid!" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email or password is not valid!" });
    }

    // Create JWT token
    const accessToken = jwt.sign(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    // Store JWT in HTTP-only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,        // JS cannot access
      secure: false,         // true in production (HTTPS)
      sameSite: "Strict",    // helps prevent CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send only user info to frontend
    return res.status(200).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    console.log(req.user);
    res.status(200).json({
      success: true,
      data: {
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
// routes/auth.js or controller

export const logout = (req, res) => {
  // Clear the HTTP-only cookie
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
}

