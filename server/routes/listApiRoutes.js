// server/routes/listApiRoutes.js
const express = require("express");
const router = express.Router();
const listController = require("../controllers/listController");
const { protect } = require("../middleware/authMiddleware");

// --- MODIFICATION START ---
// 1. Import cardRoutes
const cardRoutes = require('./cardRoutes'); 

// Routes for a specific list (PUT /api/lists/:listId, DELETE /api/lists/:listId)
router
  .route("/:listId")
  .put(protect, listController.updateList)
  .delete(protect, listController.deleteList);

// 2. Use cardRoutes for any requests to /:listId/cards
// This will handle GET, POST, etc. for cards under a specific list
router.use('/:listId/cards', protect, cardRoutes);

// 3. The line below is now redundant and can be removed for cleaner code,
// because cardRoutes already handles GET requests.
// router.get("/:listId/cards", protect, cardController.getCardByList);
// --- MODIFICATION END ---

module.exports = router;