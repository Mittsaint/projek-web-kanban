const express = require("express");
const router = express.Router({ mergeParams: true }); 
const cardController = require("../controllers/cardController");
const { protect } = require("../middleware/authMiddleware"); 
const labelController = require("../controllers/labelController");
const checklistRoutes = require("./checklistRoutes");
const commentRoutes = require("./commentRoutes"); //

// @route   POST /api/lists/:listId/cards
// @desc    Create a new card within a list
router.post("/", protect, cardController.createCard); 

// @route   GET /api/lists/:listId/cards
// @desc    Get all cards for a specific list
router.get("/", protect, cardController.getCardByList);

// @route   PUT /api/cards/:cardId
// @desc    Update a card
router.put("/:cardId", protect, cardController.updateCard);

// @route   DELETE /api/cards/:cardId
// @desc    Archive a card (soft delete)
router.delete("/:cardId", protect, cardController.deleteCard);

// @route   POST /api/cards/:cardId/labels
// @desc    Add a label to a card
router.post("/:cardId/labels", protect, labelController.addLabelToCard);

// @route   DELETE /api/cards/:cardId/labels/:labelId
// @desc    Remove a label from a card
router.delete("/:cardId/labels/:labelId", protect, labelController.removeLabelFromCard);
router.use("/:cardId/checklists", checklistRoutes);
router.use("/:cardId/comments", commentRoutes);
router.post("/:cardId/copy", protect, cardController.copyCard);

module.exports = router;