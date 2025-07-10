// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = generateToken(req.user._id);
      
      // Prepare user data
      const userData = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        provider: req.user.provider,
        profilePictureUrl: req.user.profilePictureUrl,
        token: token
      };

      // Send message to parent window (frontend)
      res.send(`
        <script>
          console.log('Google auth callback successful');
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_SUCCESS',
            user: ${JSON.stringify(userData)}
          }, '${process.env.CLIENT_URL}');
          window.close();
        </script>
      `);
    } catch (error) {
      console.error('Google auth callback error:', error);
      res.send(`
        <script>
          console.error('Google auth callback failed');
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: 'Authentication failed'
          }, '${process.env.CLIENT_URL}');
          window.close();
        </script>
      `);
    }
  }
);

module.exports = router;