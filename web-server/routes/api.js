const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();
const { dbConfig } = require('../init-db');
const { login , verify_auth, movieQueryHandler, logout, create_user} = require('../controller');

// Logging middleware
router.use((req, res, next) => {
  if (!req.path.endsWith('.ico') && !req.path.endsWith('.css') && !req.path.endsWith('.js')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

router.get('/movies', movieQueryHandler('SELECT title FROM movies'));
router.get('/rooms', movieQueryHandler('SELECT name FROM rooms'));
router.get('/screenings', movieQueryHandler('SELECT screenings.id as id, title, timecode, seats FROM screenings JOIN movies ON screenings.id_movie = movies.id'));
router.get('/seats/:id', movieQueryHandler('SELECT * FROM screenings WHERE id = ?', true));
router.get('/purchases/:id', movieQueryHandler('SELECT seats FROM purchases where id_projection = ?', true));

router.post('/login', login);
router.post('/logout', logout);
router.post('/create-user', create_user);
router.post("/me", verify_auth, (req, res) => {
    res.json({ id: req.user.id, username: req.user.username, type: req.user.type });
});

//prima di entrare in /private, verifica autenticazione
router.use('/private', verify_auth);

// Tutte le pagine private devono avere una rotta con router.get altrimenti non saranno accessibili

module.exports = router;
