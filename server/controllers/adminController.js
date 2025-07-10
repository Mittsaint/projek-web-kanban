const User = require("../models/User");
const Board = require("../models/Board");
const Card = require("../models/Card");
const List = require("../models/List");

/**
 * @desc    Get all boards (for admin panel)
 * @route   GET /api/admin/boards
 * @access  Private/Admin
 */
const getAllBoardsAdmin = async (req, res) => {
  try {
    const boards = await Board.find({}).populate("ownerId", "name email");
    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Delete a single board as an admin
 * @route   DELETE /api/admin/boards/:id
 * @access  Private/Admin
 */
const deleteBoardAdmin = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }
    await board.deleteOne();
    res.json({ msg: "Board removed by admin" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get application statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getAppStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const boardCount = await Board.countDocuments();
    const listCount = await List.countDocuments();
    const cardCount = await Card.countDocuments();
    res.json({ userCount, boardCount, listCount, cardCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get user growth data for the last 7 days
 * @route   GET /api/admin/stats/user-growth
 * @access  Private/Admin
 */
const getUserGrowthStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const userGrowthData = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo, $lte: today } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, newUsers: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, day: "$_id", newUsers: "$newUsers" } },
    ]);

    const userGrowthMap = new Map(userGrowthData.map(item => [item.day, item.newUsers]));
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      result.push({ day: dateString, newUsers: userGrowthMap.get(dateString) || 0 });
    }
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Delete multiple boards as an admin
 * @route   DELETE /api/admin/boards
 * @access  Private/Admin
 */
const deleteMultipleBoardsAdmin = async (req, res) => {
  try {
    const { boardIds } = req.body;
    if (!boardIds || !Array.isArray(boardIds) || boardIds.length === 0) {
      return res.status(400).json({ msg: "Board IDs must be a non-empty array." });
    }
    const result = await Board.deleteMany({ _id: { $in: boardIds } });
    if (result.deletedCount === 0) {
        return res.status(404).json({ msg: "No matching boards found to delete." });
    }
    res.json({ msg: `${result.deletedCount} boards removed by admin.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Delete multiple users as an admin
 * @route   DELETE /api/admin/users
 * @access  Private/Admin
 */
const deleteMultipleUsersAdmin = async (req, res) => {
  try {
    const { userIds } = req.body;
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ msg: "User IDs must be a non-empty array." });
    }
    const filteredUserIds = userIds.filter(id => id.toString() !== req.user.id.toString());
    if (filteredUserIds.length === 0 && userIds.length > 0) {
        return res.status(400).json({ msg: "Cannot delete your own account." });
    }
    const result = await User.deleteMany({ _id: { $in: filteredUserIds } });
    if (result.deletedCount === 0) {
        return res.status(404).json({ msg: "No matching users found to delete." });
    }
    res.json({ msg: `${result.deletedCount} users removed by admin.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// --- ADD THE MISSING FUNCTIONS HERE ---

/**
 * @desc    Get all users (for admin panel)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsersAdmin = async (req, res) => {
  try {
    // Exclude passwords from the result
    const users = await User.find({}).select("-password"); 
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Delete a single user as an admin
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Prevent an admin from deleting their own account
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ msg: "You cannot delete your own account." });
    }

    await user.deleteOne();

    res.json({ msg: "User removed by admin." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


// --- EXPORT ALL FUNCTIONS ---
module.exports = {
    getAllBoardsAdmin,
    deleteBoardAdmin,
    getAppStats,
    getUserGrowthStats,
    deleteMultipleBoardsAdmin,
    deleteMultipleUsersAdmin,
    getAllUsersAdmin,       // Export the new function
    deleteUserAdmin,        // Export the new function
};
