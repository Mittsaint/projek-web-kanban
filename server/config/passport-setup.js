// File: passport-setup.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.SERVER_CALLBACK_URL,
    },
    // --- PERBAIKAN DI SINI: 'accesToken' menjadi 'accessToken' ---
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      const picture =
        profile.photos && profile.photos.length > 0
          ? profile.photos[0].value
          : null;

      try {
        let user = await User.findOne({ email: email });

        if (user) {
          if (!user.provider) {
            user.provider = "google";
            await user.save();
          }
          done(null, user);
        } else {
          const newUser = new User({
            name: profile.displayName,
            email: email,
            provider: "google",
            profilePictureUrl: picture,
          });
          user = await newUser.save();
          done(null, user);
        }
      } catch (err) {
        console.error("Error in Google Strategy:", err);
        done(err, null);
      }
    }
  )
);

// Serialize dan Deserialize tetap sama
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});