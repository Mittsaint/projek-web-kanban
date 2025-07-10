const express = require("express");
const router = express.Router();
const { getAllUserActivities } = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware");

// @desc    Get all activities for the currently logged-in user
// @route   GET /api/activities/
// This is the only route that should be in this file.
router.get('/', protect, getAllUserActivities);

module.exports = router;