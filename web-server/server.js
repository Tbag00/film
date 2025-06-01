// server web qui, rotte in routes.js, verifica autenticazione in verify_auth.js, funzioni in controller.js
const express = require('express');
const router = require('./routes');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;
const app = express();

async function main() {
    app.use(express.json());
    app.use(cookieParser());

    app.use(express.static('public'));
    app.use('/', router);

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

main().catch(err => {
    console.error("Error starting the server:", err);
    process.exit(1); // Exit the process with failure code
});