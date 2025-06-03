const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();
const { dbConfig } = require('../init-db');

router.post('/', async (req, res) => {
  const { name, duration } = req.body;
  const lowerName = name.toUpperCase();
  if (!lowerName) return res.redirect('/private/manager/film_manager.html?error=campi_obbligatori');

  try {
    const db = await mysql.createConnection(dbConfig);

    const [rows] = await db.query('SELECT * FROM movies WHERE title = ?', [lowerName]); 
    if (rows.length > 0) {
      await db.end();
      return res.redirect('/private/manager/film_manager.html?error=film_esistente');
    }
    if(parseInt(duration) < 1){
      await db.end();
      return res.redirect('/private/manager/film_manager.html?error=durata'); 
    }

    await db.query('INSERT INTO movies (title, duration) VALUES (?, ?)', [lowerName, parseInt(duration)]);
    await db.end();
    return res.redirect('/private/manager/film_manager.html?success=aggiunto');
  } catch (err) {
    console.error(err);
    return res.redirect('/private/manager/film_manager.html?error=errore_db');
  }
});

router.post('/delete', async (req, res) => {
  const { name } = req.body;
  const lowerName = name.toUpperCase();
  if (!lowerName) return res.redirect('/private/manager/film_manager.html?error=campi_obbligatori');

  try {
    const db = await mysql.createConnection(dbConfig);

    const [rows] = await db.query('SELECT * FROM movies WHERE title = ?', [lowerName]); 
    if (rows.length < 1) {
      await db.end();
      return res.redirect('/private/manager/film_manager.html?error=non_trovato');
    }

    await db.query('DELETE FROM movies WHERE title = ?', [lowerName]);
    await db.end();
    return res.redirect('/private/manager/film_manager.html?success=rimosso');
  } catch (err) {
    console.error(err);
    return res.redirect('/private/manager/film_manager.html?error=errore_db');
  }
});

module.exports = router;