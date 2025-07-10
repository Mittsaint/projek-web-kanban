// routes/cardRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true }); 
const cardController = require("../controllers/cardController");
const { protect } = require("../middleware/authMiddleware"); 
const labelController = require("../controllers/labelController");
const checklistRoutes = require("./checklistRoutes");
const commentRoutes = require("./commentRoutes");

// Create a new card within a list
router.post("/", protect, cardController.createCard); 

// Get all cards for a specific list
router.get("/", protect, cardController.getCardByList);

// Update a card
router.put("/:cardId", protect, cardController.updateCard);

// Archive a card (soft delete)
router.delete("/:cardId", protect, cardController.deleteCard);

// Add a label to a card
router.post("/:cardId/labels", protect, labelController.addLabelToCard);

// Remove a label from a card
router.delete("/:cardId/labels/:labelId", protect, labelController.removeLabelFromCard);

// Nested checklist routes
router.use("/:cardId/checklists", checklistRoutes);

// Nested comment routes
router.use("/:cardId/comments", commentRoutes);

// Copy a card
router.post("/:cardId/copy", protect, cardController.copyCard);

module.exports = router;