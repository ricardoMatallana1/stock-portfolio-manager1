require('dotenv').config({ path: './google.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
app.use(cors());
app.use(express.json());

// Session setup
app.use(session({
  secret: 'secret-key', // You can replace this with a better secret
  resave: false,
  saveUninitialized: false,
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect('mongodb://rickymatallana10:Og1eNB8iI2YbBkQl@ac-cat99qr-shard-00-00.edkqy1x.mongodb.net:27017,ac-cat99qr-shard-00-01.edkqy1x.mongodb.net:27017,ac-cat99qr-shard-00-02.edkqy1x.mongodb.net:27017/?replicaSet=atlas-bst2bg-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority', {
    dbName: 'stock-portfolio'
});

  
  

// Mongoose model
const stockSchema = new mongoose.Schema({
  name: String,
  shares: Number,
  price: Number
});
const Stock = mongoose.model('Stock', stockSchema);

// Passport Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Here you'd normally save or find the user in DB
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // or redirect to your front-end
  }
);

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Not logged in');
  }
  res.send(req.user);
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Portfolio API
app.get('/api/stocks', async (req, res) => {
  const stocks = await Stock.find();
  res.json(stocks);
});

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
