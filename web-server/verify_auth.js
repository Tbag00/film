// middleware che chiede all'auth server validità token e eventualmente
// restituisce utente in req.body
//const fetch = require('node-fetch');
const axios = require('axios'); // Use axios for HTTP requests to other services

async function verify_auth(req, res, next) {
    const token = req.cookies.token;
    if(!token) {
        console.log("Token missing");
        return res.status(401).json({ error: "Token mancante" });
    }
    else {
        try {
            const auth_response = await axios.post("http://localhost:4000/api/verify-token", {
            //const auth_response = await axios("http://auth:4000/api/verify-token", {
                token: req.cookies.token
            });

            // data = {valid: Bool, user: Json}
            // user = {id: Int, username: String, type: String}
            const data = auth_response.data;
            if (!data.valid) {
                console.log("Invalid token");
                return res.status(403).json({ error: "Token non valido"});
            }
            else {
                req.user = data.user;   // Salva utente in campo custom req.user
                next();
            }
        }
        catch(err) {
            console.error("Error during token validation", err);
            return res.status(500).json({ error: "Internal server error"});
        }
    }
}

module.exports = verify_auth;