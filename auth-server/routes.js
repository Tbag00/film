//router, definisce le rotte di autenticazione
require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const {login} = require('./auth-controller');

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
            token = jwt.sign(result.user, process.env.JWT_SECRET, {
                algorithm: "HS256",
                expiresIn: "20m"
            })
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                maxAge: 20 * 60 * 1000 // 20 minutes
            })
            message = `${username} logged successfully`;
            console.log(message);
            return res.status(200).json({ success: true, message });
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

module.exports = router;