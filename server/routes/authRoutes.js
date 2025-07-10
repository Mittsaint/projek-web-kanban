const express = require("express");
const router = express.Router();
const passport = require("passport");
const { loginUser, registerUser } = require("../controllers/authController");
const authController = require('../controllers/authController');
const generateToken = require('../utils/generateToken'); 

// @route   POST /api/auth/register
// @desc    Register a new User
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    User login and get Token
router.post("/login", loginUser);

// Rute untuk memulai proses otentikasi Google
// Saat frontend mengakses URL ini, pengguna akan diarahkan ke halaman login Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'], // Data yang kita minta dari Google
    session: false
}));

// Rute callback yang akan diakses Google setelah user login
// Ini adalah rute yang menjalankan strategi di passport-setup.js,
// lalu jika berhasil, akan memanggil controller googleLoginCallback.
router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` // Redirect jika gagal
    }),
    authController.googleLoginCallback // Panggil controller baru kita jika berhasil
);

module.exports = router;
