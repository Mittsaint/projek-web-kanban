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
    const activities = await ActivityLog.find({
      BoardId: { $in: boardIds },
      userId: req.user.id
    })
      .populate("userId", "name email")
      .populate("BoardId", "title")
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
