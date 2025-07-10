// server/routes/listRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const listController = require("../controllers/listController");
const { protect } = require("../middleware/authMiddleware");

// Import Routes
const cardRoutes = require('./cardRoutes');

// @route   POST /api/boards/:boardId/lists
// @desc    Create a new list within a board
router.post("/", protect, listController.createdList);

// @route   GET /api/boards/:boardId/lists
// @desc    Get all lists for a specific board
router.get("/", protect, listController.getListByBoard);

// Nested Route for Cards
router.use('/:listId/cards', protect, cardRoutes);

module.exports = router;
