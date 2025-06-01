const axios = require('axios'); // Use axios for HTTP requests to other services
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
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 20 * 60 * 1000  // 20 minutes
        });
        return res.status(200).json({ message: "Login effettuato" });
    }
    catch (err) {
        console.error("Login error:", err);
        return res.status(401).json({ error: "Credenziali non valide" });
    }
}
module.exports = { login };
