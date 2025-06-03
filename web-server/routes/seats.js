const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();
const { dbConfig } = require('../init-db');

router.post('/confirm', async (req, res) => {
  const db = await mysql.createConnection(dbConfig);
  const { id_projection, seats, user_id } = req.body;
  const [rows] = await db.query('SELECT * FROM screenings WHERE id = ?', [id_projection]);
  if (rows.length === 0) return res.status(404).end();

  console.log(`[DEBUG] Acquisto per proiezione ${id_projection} da utente ${user_id} per posti: ${seats.join(',')}`);
  console.log(`[DEBUG] Stato posti prima dell'acquisto: ${rows[0].seats}`);
  console.log(`[DEBUG] rows, seats, user_id`, rows, seats, user_id);

  const current = rows[0];
  let seatString = current.seats;
  seats.forEach(i => {
    seatString = seatString.substring(0, i) + '1' + seatString.substring(i + 1);
  });

  const now = new Date();
  await db.query('UPDATE screenings SET seats = ?, available_seats = ? WHERE id = ?', [
    seatString,
    current.available_seats - seats.length,
    id_projection
  ]);

  await db.query('INSERT INTO purchases (id_projection, user_id, seats, purchase_time) VALUES (?, ?, ?, ?)', [
    id_projection,
    user_id,
    seats.join(','),
    now
  ]);

  res.status(200).end();
});

module.exports = router;