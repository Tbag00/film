// middleware che chiede all'auth server validità token e eventualmente
// restituisce utente in req.body
//const fetch = require('node-fetch');
const axios = require('axios'); // Use axios for HTTP requests to other services

async function verify_auth(req, res, next) {
    if(!req.cookies || !req.cookies.token) {
        console.log("Token missing");
        return res.status(401).redirect('/index.html?error=1'); // Redirect to home page with error
    }
    else if (req.cookies.token === "undefined") {
        console.log("Token is undefined");
        return res.status(401).redirect('/index.html?error=1'); // Redirect to home page with error
    }
    // token presente e definito
    else {
    const token = req.cookies.token;
    console.log("Ricevuto token:", token);
    console.log(req.cookies);
        try {
            const auth_response = await axios.post("http://localhost:4000/api/verify-token", {
            //const auth_response = await axios("http://auth:4000/api/verify-token", {
                token: req.cookies.token,
                withCredentials: true
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
        catch(error) {
            if (error.response) {
                // La risposta è arrivata dal server con uno status diverso da 2xx
                console.error("Errore dall' auth-server:", error.response.data.message);
                return res.status(401).json({ error: "Token non valido" });
            }
            else if (error.request) {
                // La richiesta è partita ma non ha ricevuto risposta
                console.error('Nessuna risposta dal server:', error.request);
            }
            else {
                // Altro errore
                console.error('Errore:', error.message);
            }
            return res.status(500).json({ error: "Errore interno del server" });
        }
    }
}

module.exports = verify_auth;