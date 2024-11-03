const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

connectDB();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, 
  }));
  

// Passport Configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      });
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id, done));

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure: true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// Authentication Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.send("Successfully authenticated with Google!");
});

// Middleware to Protect Routes
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).send("Unauthorized");
}

// Protected Route Example
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`Welcome ${req.user.name}`);
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
