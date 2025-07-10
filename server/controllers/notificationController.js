const Notification = require("../models/Notification"); 

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    // Find notifications for the authenticated user, sorted by creation date (newest first)
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Mark all unread notifications as read for a user
exports.markNotificationsAsRead = async (req, res) => {
  try {
    // Update all unread notifications for the authenticated user to 'read: true'
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.json({ msg: "Notifications marked as read" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// You might also want a function to create notifications (e.g., when a new activity occurs)
// This would typically be called from other controllers (e.g., board, card controllers)
exports.createNotification = async (userId, message) => {
  try {
    const newNotification = new Notification({
      userId,
      message,
    });
    await newNotification.save();
    console.log(`Notification created for user ${userId}: ${message}`);
  } catch (err) {
    console.error("Error creating notification:", err.message);
  }
};
