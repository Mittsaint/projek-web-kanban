const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware"); // Assuming you have an auth middleware

// Route to get all notifications for the authenticated user
router.get("/", protect, notificationController.getNotifications);

// Route to mark all unread notifications as read for the authenticated user
router.put("/mark-as-read", protect, notificationController.markNotificationsAsRead);

module.exports = router;