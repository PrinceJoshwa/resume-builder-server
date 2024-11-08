// const express = require('express');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const session = require('express-session');
// const dotenv = require('dotenv');
// const User = require('./models/User');
// const connectDB = require('./config/db');
// const cors = require('cors');

// dotenv.config();
// const app = express();

// // Middleware
// app.use(express.json());

// connectDB();

// app.use(cors({
//     origin: 'https://resume-builder-client-jade.vercel.app',
//     credentials: true, 
//   }));
  

// // Passport Configuration
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SEC,
//   callbackURL: '/auth/google/callback'
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ googleId: profile.id });
//     if (!user) {
//       user = await User.create({
//         googleId: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value
//       });
//     }
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// }));

// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser((id, done) => User.findById(id, done));

// // Session Middleware
// app.use(session({
//   secret: process.env.SESSION_SEC,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } // Set secure: true if using HTTPS
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// // Authentication Routes
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google/callback', passport.authenticate('google', {
//   failureRedirect: '/'
// }), (req, res) => {
//   res.send("Successfully authenticated with Google!");
// });

// // Middleware to Protect Routes
// function isAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.status(401).send("Unauthorized");
// }

// // Protected Route Example
// app.get('/dashboard', isAuthenticated, (req, res) => {
//   res.send(`Welcome ${req.user.name}`);
// });

// // Server Start
// // const PORT = process.env.PORT || 5000;
// const PORT = process.env.PORT;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// // src/server.js
// const express = require('express');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const session = require('express-session');
// const dotenv = require('dotenv');
// const User = require('./models/User');
// const connectDB = require('./config/db');
// const cors = require('cors');

// dotenv.config();
// const app = express();

// // Middleware
// app.use(express.json());

// // Connect to MongoDB
// connectDB();

// app.use(cors({
//   origin: 'https://resume-builder-client-jade.vercel.app', // Update this with your actual frontend URL
//   credentials: true,
// }));

// // Passport Configuration
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SEC,
//   callbackURL: '/auth/google/callback'
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ googleId: profile.id });
//     if (!user) {
//       user = await User.create({
//         googleId: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value
//       });
//     }
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// }));

// // Serializing and Deserializing Users
// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id); // Using async/await instead of a callback
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// // Session Middleware
// app.use(session({
//   secret: process.env.SESSION_SEC,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: process.env.NODE_ENV === 'production' } // Secure in production
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// // Authentication Routes
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google/callback', passport.authenticate('google', {
//   failureRedirect: '/'
// }), (req, res) => {
//   res.send("Successfully authenticated with Google!");
// });

// // Middleware to Protect Routes
// function isAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.status(401).send("Unauthorized");
// }

// // Protected Route Example
// app.get('/dashboard', isAuthenticated, (req, res) => {
//   res.send(`Welcome ${req.user.name}`);
// });

// // Server Start
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// src/server.js
// src/server.js
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const User = require('./models/User');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
const app = express();

// Check for required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SEC || !process.env.SESSION_SEC || !process.env.VITE_APP_URL) {
  console.error("⚠️  Missing environment variables. Please check your .env file.");
  process.exit(1);
}

const corsOptions = {
  origin: process.env.VITE_APP_URL,
  credentials: true,
};
app.use(cors(corsOptions));

// Use Helmet for security headers
app.use(helmet());

// Logging middleware
app.use(morgan('dev'));

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Passport Configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SEC,
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

// Serialize and Deserialize Users
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SEC,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'lax'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Authentication Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: `${process.env.VITE_APP_URL}/?error=login_failed`
}), (req, res) => {
  res.redirect(`${process.env.VITE_APP_URL}/dashboard`);
});

// Endpoint to Check Authentication Status
app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
