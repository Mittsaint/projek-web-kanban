


// commentRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createComment,
  getCommentsByCard,
} = require("../controllers/commentController");
const { protect } = require('../middleware/authMiddleware');

// @route   POST /
// @desc    Create a comment
router.post("/", protect, createComment);  
// @route   GET /
// @desc    Get all comments for a card
router.get("/", protect, getCommentsByCard);

module.exports = router;