//middleware da usare in auth.js per controllare validità dei token
require('dotenv').config();
const jwt = require('jsonwebtoken');
function autenticate(req, res, next) {
    // Web server controlla già presenza token in cookie
    // Non è necessario controllarlo qui

    const token = req.cookies.token;
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        
    }
}