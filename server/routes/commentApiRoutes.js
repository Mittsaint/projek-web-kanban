// commentApiRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

// URL  /api/comments/:commentId
router
  .route("/:commentId")
  .put(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
