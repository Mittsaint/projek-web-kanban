// server/routes/listApiRoutes.js
const express = require("express");
const router = express.Router();
const listController = require("../controllers/listController");
const { protect } = require("../middleware/authMiddleware");

// Import cardRoutes
const cardRoutes = require('./cardRoutes');

// Routes for a specific list (PUT /api/lists/:listId, DELETE /api/lists/:listId)
router
  .route(":/listId")
  .put(protect, listController.updateList)
  .delete(protect, listController.deleteList);

// Use cardRoutes for any requests to /:listId/cards
router.use('/:listId/cards', protect, cardRoutes);

module.exports = router;