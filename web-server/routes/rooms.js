const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();
const { dbConfig } = require('../init-db');

router.post('/', async (req, res) => {
  const { name, seats } = req.body;
  const lowerName = name.toUpperCase();
  if (!lowerName || !seats) return res.redirect('/room_manager.html?error=campi_obbligatori');

  try {
    const db = await mysql.createConnection(dbConfig);

    const [rows] = await db.query('SELECT * FROM rooms WHERE name = ?', [lowerName]); 
    if (rows.length > 0) {
      await db.end();
      return res.redirect('/room_manager.html?error=sala_esistente');
    }

    if(parseInt(seats) < 1){
      await db.end();
      return res.redirect('/room_manager.html?error=posti');
    }

    await db.query('INSERT INTO rooms (name, seats) VALUES (?, ?)', [lowerName, parseInt(seats)]);
    await db.end();
    return res.redirect('/room_manager.html?success=aggiunta');
  } catch (err) {
    console.error(err);
    return res.redirect('/room_manager.html?error=errore_db');
  }
});

router.post('/delete', async (req, res) => {
  const { name } = req.body;
  const lowerName = name.toUpperCase();
  if (!lowerName) return res.redirect('/room_manager.html?error=campi_obbligatori');

  try {
    const db = await mysql.createConnection(dbConfig);

    const [rows] = await db.query('SELECT * FROM rooms WHERE name = ?', [lowerName]); 
    if (rows.length < 1) {
      await db.end();
      return res.redirect('/room_manager.html?error=non_trovata');
    }

    await db.query('DELETE FROM rooms WHERE name = ?', [lowerName]);
    await db.end();
    return res.redirect('/room_manager.html?success=rimossa');
  } catch (err) {
    console.error(err);
    return res.redirect('/room_manager.html?error=errore_db');
  }
});

module.exports = router;