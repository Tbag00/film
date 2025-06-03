// Tabelle:
// users: {id: autoincrement primary key,
//     username: not null, 
//     password: not null,
//     type: ("user" or "admin")not null,
// }
// password salvate con hash

require('dotenv').config();
const sql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  port: process.env.PORT
};

async function init_database() {
  console.log('Inizializzazione del database...');
  const connection = await sql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
  await connection.query(`USE \`${dbConfig.database}\`;`);
  await connection.end();

  const db = await sql.createConnection(dbConfig);

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      password VARCHAR(255) NOT NULL,
      type VARCHAR(10) NOT NULL 
    );
  `);
}

const pool = sql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = { init_database, pool };