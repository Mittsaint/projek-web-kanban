const express = require("express");
const router = express.Router({ mergeParams: true });
const labelController = require("../controllers/labelController");

// Routes for managing labels on a board
// Matches /api/boards/:boardId/labels
router
  .route("/")
  .post(labelController.createLabelForBoard)
  .get(labelController.getLabelsByBoard);

module.exports = router;
