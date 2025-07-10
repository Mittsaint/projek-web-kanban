// routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const { getActiveSessions, logoutSession } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware'); // Asumsikan Anda punya middleware ini

// Semua rute di sini dilindungi, hanya user yang login bisa akses
router.use(protect);

router.route('/')
    .get(getActiveSessions);

router.route('/:id')
    .delete(logoutSession);

module.exports = router;