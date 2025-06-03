// server web qui, rotte in routes.js, verifica autenticazione in verify_auth.js, funzioni in controller.js
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const roomsRouter = require('./routes/rooms');
const filmsRouter = require('./routes/films');
const screeningRouter = require('./routes/screenings');
const bookingRouter = require('./routes/booking');
const seatsRouter = require('./routes/seats');
const apiRouter = require('./routes/api');

require('dotenv').config();
const { initDatabase, dbConfig } = require('./init-db');

const port = process.env.PORT || 3000;
const app = express();

async function main() {
    try {
        await initDatabase();
    } catch (err) {
    console.error('Errore inizializzazione DB:', err);
  }
    app.use(express.json());
    app.use(cookieParser());

    app.use(express.static('public'));
    app.use('/api', apiRouter);
    app.use('/rooms', roomsRouter);
    app.use('/films', filmsRouter);
    app.use('/screenings', screeningRouter);
    app.use('/booking', bookingRouter);
    app.use('/seats', seatsRouter);

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.get('/room-manager', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'room_manager.html'));
    });

    app.get('/film-manager', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'film_manager.html'));
    });

    app.get('/screening-manager', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'screening_manager.html'));
    });

    app.get('/booking', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'booking_manager.html'));
    });

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

main().catch(err => {
    console.error("Error starting the server:", err);
    process.exit(1); // Exit the process with failure code
});