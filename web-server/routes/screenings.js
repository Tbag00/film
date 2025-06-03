const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();
const { dbConfig } = require('../init-db');

router.post('/', async (req, res) => {
  const { title, room, date } = req.body;
  const lowerTitle = title.toUpperCase();
  const lowerRoom = room.toUpperCase();
  if (!lowerTitle || !lowerRoom || !date) return res.redirect('/private/manager/screening_manager.html?error=campi_obbligatori');

  try {
    const db = await mysql.createConnection(dbConfig);
    const [film_id] = await db.query('SELECT id FROM movies WHERE title = ?', [lowerTitle]); 
    const [room_id] = await db.query('SELECT id FROM rooms WHERE name = ?', [lowerRoom]); 
    const [seats] = await db.query('SELECT seats FROM rooms WHERE name = ?', [lowerRoom]); 

    const [rows] = await db.query('SELECT * FROM screenings WHERE id_movie = ? AND id_room = ? AND timecode = ?', [film_id[0].id, room_id[0].id, date]); 
    if (rows.length > 0) {
      await db.end();
      return res.redirect('/private/manager/screening_manager.html?error=proiezione_esistente');
    }

    const [existing] = await db.query(`SELECT s.timecode, m.duration FROM screenings s JOIN movies m ON s.id_movie = m.id WHERE s.id_room = ?`, [room_id[0].id]);
    
    const newStart = new Date(date);
    const [movieRow] = await db.query('SELECT duration FROM movies WHERE id = ?', [film_id[0].id]);
    const newEndWithGap = new Date(newStart.getTime() + (movieRow[0].duration + 10) * 60000);
    const newStartWithGap = new Date(newStart.getTime() - 10 * 60000);

    const overlap = existing.some(row => {
      const existingStart = new Date(row.timecode);
      const existingEnd = new Date(existingStart.getTime() + row.duration * 60000);
      return newStartWithGap < existingEnd && newEndWithGap > existingStart;
    });

    if (overlap) {
      return res.redirect('/private/manager/screening_manager.html?error=conflitto');
    }

    await db.query('INSERT INTO screenings (id_movie, id_room, available_seats , timecode) VALUES (?, ?, ?, ?)', [film_id[0].id, room_id[0].id, parseInt(seats[0].seats), date]);
    await db.end();
    return res.redirect('/private/manager/screening_manager.html?success=aggiunta');
  } catch (err) {
    console.error(err);
    return res.redirect('/private/manager/screening_manager.html?error=errore_db');
  }
});

router.post('/delete', async (req, res) => {
  const ids = req.body['screenings[]'] || req.body.screenings;
  if (!ids) return res.redirect('/private/manager/screening_manager.html?error=campi_obbligatori');

  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.query('SELECT * FROM screenings WHERE id IN (?)', [ids]); 
    if (rows.length !== ids.length) {
      await db.end();
      return res.redirect('/private/manager/screening_manager.html?error=non_trovata');
    }

    const toDelete = Array.isArray(ids) ? ids : [ids];
    for (const id of toDelete) {
      await db.query('DELETE FROM screenings WHERE id = ?', [id]);
    }
    await db.end();
    return res.redirect('/private/manager/screening_manager.html?success=rimossa');
  } catch (err) {
    console.error(err);
    return res.redirect('/private/manager/screening_manager.html?error=errore_db');
  }
});

module.exports = router;