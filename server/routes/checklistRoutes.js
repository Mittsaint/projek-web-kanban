// routes/checklistRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const { createChecklist, getChecklistsByCard } = require("../controllers/checklistController");
const { protect } = require("../middleware/authMiddleware");

// Rute ini sudah benar, akan cocok dengan /api/cards/:cardId/checklists
router.route("/")
  .post(protect, createChecklist)
  .get(protect, getChecklistsByCard);

module.exports = router;