// Route per il web server
const express = require('express');
const router = express.Router();
const verify_auth = require('./verify_auth');
const { login } = require('./controller');

const axios = require('axios'); // Use axios for HTTP requests to other services

const isProduction = process.env.NODE_ENV === "production"; // Set to true in production environment, usato per configurare le opzioni di sicurezza dei cookie

// Logging middleware
router.use((req, res, next) => {
  if (!req.path.endsWith('.ico') && !req.path.endsWith('.css') && !req.path.endsWith('.js')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

router.post('/api/login', login);
router.get('/api/logout', (req, res) => {
    if(req.cookies.token) {
      res.clearCookie("token");
      console.log("User logged out successfully");
      res.redirect('/index.html?logout=1'); // Redirect to home page after logout
    }
    else {
      console.log("No user logged in");
      res.redirect('/index.html?logout=0'); // Redirect to home page with logout failure
    }
});

//prima di entrare in /private, verifica autenticazione
router.use('/private', verify_auth);

// Tutte le pagine private devono avere una rotta con router.get altrimenti non saranno accessibili
router.get('/private/admin.html', (req, res) => {
    console.log("[DEBUG] User type:", req.user.type);
    if (req.user.type !== 'admin') {
        return res.status(403).send("Accesso negato");
    }
    res.sendFile(__dirname + '/private/admin.html');
});
router.get('/private/user.html', (req, res) => {
    console.log("[DEBUG] User type:", req.user.type);
    res.sendFile(__dirname + '/private/user.html');
});
router.get('/api/cookie', async (req, res) => {
  res.cookie("test", "test_value", {
    httpOnly: true,
    secure: isProduction, // Set to true in production environment
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
  console.log("Cookie set successfully");
  res.json({ message: "Cookie set successfully" });
});
module.exports = router;