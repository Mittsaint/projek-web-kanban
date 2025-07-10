// File: utils/generateToken.js
const jwt = require('jsonwebtoken');

/**
 * Generates a JWT from a user object.
 * @param {object} user - The user object from MongoDB.
 * @returns {string} The generated JWT.
 */
const generateToken = (user) => {
  // Masukkan semua data penting yang dibutuhkan di frontend ke dalam payload
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    provider: user.provider,
    profilePictureUrl: user.profilePictureUrl,
    gender: user.gender,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;