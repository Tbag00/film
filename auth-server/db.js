// Tabelle:
// users: {id: autoincrement primary key,
//     username: not null, 
//     password: not null,
//     type: ("user" or "admin")not null,
// }
// password salvate con hash

require('dotenv').config();
const sql = require("mysql2/promise");

const pool = sql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = { pool };