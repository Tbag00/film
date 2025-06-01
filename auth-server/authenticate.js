//middleware da usare in auth.js per controllare validità dei token
const jwt = require('jsonwebtoken');
function autenticate(req, res, next) {
    // Web server controlla già presenza token in cookie
    // Non è necessario controllarlo qui

    const token = req.cookies.token;
    try {
        try {
            const payload = jwt.verify(token, SECRET);
            req.valid = true;
        }
    }

}