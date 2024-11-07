require('dotenv').config()

const express = require('express');
const app = express();
const path = require('path');
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
app.use(express.static('public'));
const mongoose = require("mongoose");
const User = require("./schema/userInfo");
const configPassport = require("./config/passport");
const session = require('express-session');


//mongoDB

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error: ", err));


//session 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

configPassport();

//routes

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views/index.html'));
});


app.get("/auth/google" , 
  passport.authenticate('google' , {scope: ['profile' , 'email']})
);

app.get("/auth/google/callback" , 
  passport.authenticate('google' , {failureRedirect: '/'}),
  (req,res)=>  {
    res.redirect('/dashboard');
  }
);

//api route for user info

app.get('/api/user'  , (req,res) => {
  res.json({
    displayName: req.user.displayName,
    email: req.user.email,
    profilePhoto: req.user.profilePhoto,
    
  });
});

//dashboard
app.get('/dashboard' , (req,res)=>{
  res.sendFile(__dirname + '/views/dashboard.html' );
})
app.get('/' , (req,res)=>{
  req.logout((err)=>{
    if (err){return next(err);}
    res.redirect('/');
  });
});

app.listen(8080 ,()=>{
    console.log(`App is listening on http://localhost:8080`);
})