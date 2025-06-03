//router, definisce le rotte di autenticazione
require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { login, create_user } = require('./auth-controller');
const authenticate = require('./authenticate');

router.post('/api/login', async (req, res) => {
    const {username, password} = req.body;
    console.log(`ricevuto utente ${username} e password ${password}`);

    if(!username || !password) {
        console.log("Missing username or password for login");
        res.status(400).json({ error: "Username or password missing" });
    }
    try {
        const result = await login(username, password);
        if(result.success) {

            const payload = {
                id: result.user.id,
                username: result.user.username,
                type: result.user.type
            };

            // token contiene id, username e type dell'utente
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                algorithm: "HS256",
                expiresIn: "20m"
            })
            message = `${username} logged successfully`;
            console.log(message);
            return res.status(200).json({ success: true, token, message: message });
        }
        else {
            console.log("Login failed: " + result.message);
            return res.status(401).json({ success: false, message: result.message });
        }
    }
    catch (err) {
        console.error("Error during login", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
router.post('/api/verify-token', authenticate, (req, res) => {
    // Se il middleware ha passato il controllo, l'utente è autenticato
    return res.status(200).json({
        valid: true,
        user: req.user // L'utente è già stato aggiunto da verify_auth
    });
});

router.post('/api/create-user', create_user);
module.exports = router;