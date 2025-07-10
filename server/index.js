const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const path = require("path");
const { protect } = require("./middleware/authMiddleware");

// Import the Route
const userRoutes = require("./routes/userRoutes");
const boardRoutes = require("./routes/boardRoutes");
const authRoutes = require("./routes/authRoutes");
const cardRoutes = require("./routes/cardRoutes"); 
const listApiRoutes = require("./routes/listApiRoutes");
const commentApiRoutes = require("./routes/commentApiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const activityRoutes = require("./routes/activityRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const checklistsApiRoutes = require("./routes/checklistsApiRoutes");
const dndRoutes = require("./routes/dndRoutes");

// Load environment variable from .env file
dotenv.config();

require("./config/passport-setup");
const app = express();


// Middleware
app.use(cors({
  origin: ['https://boardly-two.vercel.app', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(passport.initialize());

// Serve static files (profile pictures, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.log(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listApiRoutes); 
app.use("/api/cards", cardRoutes);
app.use("/api/comments", commentApiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activities", activityRoutes);
app.use('/uploads', express.static('uploads'));
app.use("/api/sessions", sessionRoutes);
app.use("/api/checklists", checklistsApiRoutes);
app.use("/api/dnd", protect, dndRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));