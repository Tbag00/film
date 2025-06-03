const axios = require('axios'); // Use axios for HTTP requests to other services
const { dbConfig } = require('./init-db');
const mysql = require('mysql2/promise');

// Se serve il parametro id da url usare byId = true
function movieQueryHandler(query, byId = false) {
  return async (req, res) => {
    try {
      const db = await mysql.createConnection(dbConfig);
      const params = byId ? [req.params.id] : [];
      const [rows] = await db.query(query, params);
      await db.end();

      if (byId && rows.length === 0)
        return res.status(404).json({ error: 'Elemento non trovato' });

      res.json(byId ? rows[0] : rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Errore DB' });
    }
  };
}


async function login(req, res) {
    try {
        const {username, password} = req.body;
        console.log(`ricevuto utente ${username} e password ${password}`);
        const auth_response = await axios.post('http://localhost:4000/api/login', {
        // const auth_response = await axios.post('http://auth:4000/api/login', {
            username,
            password
        });
        console.log("Auth response:", auth_response.data);

        const token = auth_response.data.token;
        console.log("Ricevuto token:", token);
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 20 * 60 * 1000  // 20 minutes
        });
        return res.status(200).json({ message: "Login effettuato" });
    }
    catch (error) {
        if (error.response) {
            // La risposta è arrivata dal server con uno status diverso da 2xx
            console.error("Errore dall' auth-server:", error.response.data.message);
            return res.status(401).json({ error: "Credenziali non valide" });
        } else if (error.request) {
            // La richiesta è partita ma non ha ricevuto risposta
            console.error('Nessuna risposta dal server:', error.request);
        } else {
            // Altro errore
            console.error('Errore:', error.message);
        }
        return res.status(500).json({ error: "Errore interno del server" });
    }
}

async function logout(req, res) {
    if(req.cookies.token) {
        res.clearCookie("token");
        console.log("User logged out successfully");
        return res.status(200).redirect('/index.html?logout=1'); // Redirect to home page after logout
    }
    else {
        console.log("No user logged in");
        return res.status(401).redirect('/index.html?logout=0'); // Redirect to home page with logout failure
    }
}

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

module.exports = { login, verify_auth, movieQueryHandler, logout};