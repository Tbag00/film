const express = require('express');
const routes = require('./routes.js');
const { init_database } = require('./db.js'); 
require('dotenv').config();

const port = process.env.PORT || 4000;

async function main() {
    try {
        await init_database();
    } catch (err) {
        console.error('Errore inizializzazione DB:', err);
        process.exit(1); // Esci con codice di errore
    }
    const app = express();
    app.use(express.json());
    app.use('/', routes);
    app.listen(port, () => {
        console.log(`Auth server running on port ${port}`);
    });
}
main().catch(err => {
    console.error("Error starting the server:", err);
    process.exit(1); // Exit the process with failure code
});