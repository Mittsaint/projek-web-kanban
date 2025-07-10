const express = require("express");
const router = express.Router();
const { moveCard, updateListOrder, updateCardOrder } = require("../controllers/dndController");

// Route untuk memindahkan card
router.put("/move", moveCard); // FIX: ubah jadi router.put agar bisa diakses dan sesuai RESTful

// Route untuk update urutan list
router.post("/list", updateListOrder);

// Route untuk update urutan card
router.post("/card", updateCardOrder);

module.exports = router;
