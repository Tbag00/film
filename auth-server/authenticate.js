//middleware da usare in auth.js per controllare validità dei token

require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function autenticate(req, res, next) {
    // Web server controlla già presenza token in cookie
    // Non è necessario controllarlo qui

    const token = req.body.token;
    console.log("Ricevuto token:", token);

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();  
    }
    catch (err) {
        console.error("Token verification failed", err);
        return res.status(403).json({ error: "Token non valido" });
    }
}
module.exports = autenticate;