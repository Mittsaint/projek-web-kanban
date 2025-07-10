const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardControllers");
const { protect } = require("../middleware/authMiddleware");

// Import other routes
const listRoutes = require("./listRoutes");
const labelRoutes = require("./labelRoutes");
const activityRoutes = require("./activityRoutes");
const dndRoutes = require("./dndRoutes");

// Route to get all archived boards
router.get("/archived", protect, boardController.getArchivedBoards);

// This route is specifically for creating boards from templates
router.post("/from-template", protect, boardController.createBoardFromTemplate);

// Main routes for active boards
router
  .route("/")
  .get(protect, boardController.getBoards) // Gets active boards
  .post(protect, boardController.createBoard);

// Route for a specific board
router
  .route("/:boardId")
  .get(protect, boardController.getBoardById) // Added: Get a single board by ID
  .put(protect, boardController.updateBoard); // Updates board title, etc.

// Route specifically for archiving a board
router.put("/:boardId/archive", protect, boardController.archiveBoard);

// Route specifically for UN-archiving a board
router.put("/:boardId/unarchive", protect, boardController.unarchiveBoard);

// Route for PERMANENTLY deleting a board
router.delete("/:boardId/permanent", protect, boardController.deleteBoardPermanently);

// Route for board layout
router.put('/:boardId/layout', protect, boardController.updateBoardLayout);

// Nested Routes
router.use("/:boardId/lists", protect, listRoutes);
router.use("/:boardId/labels", protect, labelRoutes);
router.use("/:boardId/activities", protect, activityRoutes);
router.use("/:boardId/dnd", protect, dndRoutes);
router.put("/:boardId/toggle-pin", protect, boardController.togglePinBoard);
router.post("/:boardId/members", protect, boardController.addMemberToBoard);

module.exports = router;