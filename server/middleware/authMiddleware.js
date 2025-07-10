const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if there is 'Authorization' on Header that start with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get Token from header (without 'Bearer)
      token = req.headers.authorization.split(" ")[1];

      // Verif the token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user data from DB using ID on TOKEN
      // Add .select('-password')
      req.user = await User.findById(decoded.id).select("-password");

      // Keep to the next process
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ msg: "Not authorized, token failed" });
    }
  }

  // If there is no Token
  if (!token) {
    res.status(401).json({ msg: "Not authorized, no token" });
  }
};

// If user is Admin
const isAdmin = (req, res, next) => {
  // this middle make assumption that 'protect' is already run before,
  // so there is already content for req.user
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    // Error 403 means i know who you are, but you dont have permission
    res.status(403).json({ msg: "Not Authorized as an admin" });
  }
};

module.exports = { protect, isAdmin };
