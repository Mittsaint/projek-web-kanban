// routes/checklistsApiRoutes.js
const express = require("express");
const router = express.Router();
const {
  deleteChecklist,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem
} = require("../controllers/checklistController");
const { protect } = require("../middleware/authMiddleware");

// --- Rute untuk Checklist ---
// DELETE /api/checklists/:checklistId
router.route("/:checklistId").delete(protect, deleteChecklist);

// --- Rute untuk Checklist Items ---
// POST /api/checklists/:checklistId/items
router.route("/:checklistId/items").post(protect, addChecklistItem);

// PUT & DELETE /api/checklists/:checklistId/items/:itemId
router.route("/:checklistId/items/:itemId")
  .put(protect, updateChecklistItem)
  .delete(protect, deleteChecklistItem);

module.exports = router;