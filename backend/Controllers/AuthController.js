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

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        message: "User already exists, you can login",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Signup successfully", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are mandatory!" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email or password is not valid!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Email or password is not valid!" });

    const accessToken = jwt.sign(
      { user: { id: user._id, name: user.name, email: user.email } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,       // required for HTTPS
      sameSite: "none",   // required for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized", success: false });
    res.status(200).json({ success: true, data: { _id: req.user.id, name: req.user.name, email: req.user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  res.status(200).json({ message: "Logged out successfully" });
};


