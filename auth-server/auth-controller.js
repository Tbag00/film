// definisce funzioni usate da auth.js
const bcrypt = require('bcrypt');
const { pool } = require('./db'); 

const saltRounds = 10;

async function login(username, password) {
    const query = 'SELECT * FROM users WHERE username = ?';

    try {
        const [users] = await pool.execute(query, [username]);

        if (users.length === 0) {
            return { success: false, message: "No user found" };
        }

        const user = users[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return { success: false, message: "Incorrect password" };
        }

        return {
            success: true,
            user: {
                id: user.id,
                username: user.username,
                type: user.type
            }
        };
    } catch (err) {
        console.error("Database error during login", err);
        return { success: false, message: "Internal server error" };
    }
}
async function create_user(req, res) {
    const { username, password, type } = req.body;

    if (!username || !password || !type) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const query = 'INSERT INTO users (username, password, type) VALUES (?, ?, ?)';
        const [result] = await pool.execute(query, [username, hashedPassword, type]);

        return res.status(201).json({ success: true, userId: result.insertId });
    } catch (err) {
        console.error("Database error during user creation", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = { login, create_user };