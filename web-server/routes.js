// Route per il web server
const express = require('express');
const router = express.Router();
const verify_auth = require('./verify_auth');
const { login } = require('./controller');

const isProduction = process.env.NODE_ENV === "production"; // Set to true in production environment, usato per configurare le opzioni di sicurezza dei cookie

// Logging middleware
router.use((req, res, next) => {
  if (!req.path.endsWith('.ico') && !req.path.endsWith('.css') && !req.path.endsWith('.js')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});


router.post('/api/login', login);

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
router.get('/private/style.css', (req, res) => {
    res.sendFile(__dirname + '/private/style.css');
});
module.exports = router;