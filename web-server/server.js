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
const { initDatabase, dbConfig, waitForDb } = require('./init-db');
const { verify_auth, verify_manager_role } = require('./controller');

const port = process.env.PORT || 3000;
const app = express();

async function main() {
    try {
        await waitForDb();
        await initDatabase();
    } catch (err) {
    console.error('Errore inizializzazione DB:', err);
  }
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));    // Per le POST nei form HTML

    app.use(express.static('public'));
    app.use('/style', express.static('style'));
    app.use('/api', apiRouter);
    app.use('/rooms', roomsRouter);
    app.use('/films', filmsRouter);
    app.use('/screenings', screeningRouter);
    app.use('/booking', bookingRouter);
    app.use('/seats', seatsRouter);

    app.use(
        '/private/manager',
        verify_auth,
        verify_manager_role,
        express.static('private/manager')
    );

    app.use(
        '/private',
        verify_auth,
        express.static('private')
    );

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

    app.use((req, res) => {
        res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    });

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

main().catch(err => {
    console.error("Error starting the server:", err);
    process.exit(1); // Exit the process with failure code
});