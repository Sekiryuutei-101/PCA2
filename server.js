require('dotenv').config();

const express = require('express');
const path = require('path');
const passport = require("passport");
const mongoose = require("mongoose");
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");

const User = require("./schema/userInfo2"); // Ensure this is correct
const configPassport = require("./config/passport");
const { generateSalt, hashPassword } = require("./hashing");

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
configPassport();

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views/index.html'));
});

app.get("/auth/google", 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get("/auth/google/callback", 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// API route for user info
app.get('/api/user', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json({
    displayName: req.user.displayName,
    email: req.user.email,
    profilePhoto: req.user.profilePhoto,
  });
});

// Dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, './views/dashboard.html'));
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Register user through forms
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Salt and hash password
  const salt = await generateSalt();
  const hashedPassword = await hashPassword(salt,password);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  newUser.save()
    .then(() => {
      console.log("Data saved!");
      res.redirect('/dashboard'); // Redirect on success
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error saving user data"); // Send error response
    });
});

app.listen(8080, () => {
  console.log(`App is listening on http://localhost:8080`);
});
