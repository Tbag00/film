// definisce funzioni usate da auth.js
const { pool } = require('./db'); 

async function login(username, password) {
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    try {
        console.log("[DEBUG] Eseguo query:", query, [username, password]);
        const [users] = await pool.execute(query, [username, password]);
        if (users.length === 0) {
            return { success: false, message: "No user found" };
        }
        else {
            user = users[0]; 
            return { success: true, user: { id: user.id, username: user.username } };
        }
    } catch (err) {
        console.error("Database error during login", err);
        return { success: false, message: "Internal server error" };
    }
}   

module.exports = { login };