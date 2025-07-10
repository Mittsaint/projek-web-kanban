// server/controllers/activityController.js
const ActivityLog = require("../models/ActivityLog");
const Board = require("../models/Board"); // Import Board model to check user membership

// @desc    Get all activities for a specific board
// @route   GET /api/boards/:boardId/activities
exports.getActivitiesByBoard = async (req, res) => {
  try {
    // Ensure the user is a member of the board before fetching activities
    const board = await Board.findById(req.params.boardId);
    if (!board || !board.members.includes(req.user.id)) {
      return res.status(401).json({ msg: "User not authorized to view this board's activities" });
    }

    const activities = await ActivityLog.find({ BoardId: req.params.boardId }) // Use BoardId (capital B) for consistency with schema
      .populate("userId", "name email") // Populate user info
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Get all activities for the authenticated user across all boards they are a member of
// @route   GET /api/activities
exports.getAllUserActivities = async (req, res) => {
  try {
    // Find all boards where the user is a member
    const userBoards = await Board.find({ members: req.user.id }).select('_id');
    const boardIds = userBoards.map(board => board._id);

    // Find all activities associated with these boards and the user
    // We filter by BoardId (boards the user is a member of) AND userId (activities performed by the user)
    // This ensures we only show activities on boards they have access to, and optionally, activities they performed.
    // If you want *all* activities on boards they are a member of (even by other members), remove the userId filter.
    const activities = await ActivityLog.find({
      BoardId: { $in: boardIds }, // Activities on boards the user is a member of
      userId: req.user.id // Activities performed by the current user
    })
      .populate("userId", "name email") // Populate user info
      .populate("BoardId", "title") // Populate board title
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
