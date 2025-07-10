const express = require("express");
const router = express.Router();
const { moveCard, updateListOrder, updateCardOrder } = require("../controllers/dndController");

// Route untuk move card (dipanggil dari boardRoutes)
router.moveCard = moveCard;

// Route untuk update list order
router.post("/list", updateListOrder);

// Route untuk update card order (jika menggunakan endpoint terpisah)
router.post("/card", updateCardOrder);

module.exports = router;