import jwt from "jsonwebtoken";

const validateToken = (req, res, next) => {
  try {
    // 1️⃣ Get token from cookie
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "No token, unauthorized" });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3️⃣ Attach user info to request
    req.user = decoded.user; // same payload you set in jwt.sign()
    console.log("Decoded user:", req.user);

    next();
  } catch (err) {
    console.error("Token validation error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default validateToken;
