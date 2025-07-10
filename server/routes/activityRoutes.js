// routes/activityRoutes.js
const express = require("express");
const router = express.Router();
const { getAllUserActivities } = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware");

// Get all activities for the currently logged-in user
router.get('/', protect, getAllUserActivities);

module.exports = router;
