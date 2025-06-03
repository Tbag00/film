const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  port: process.env.PORT
};

async function initDatabase() {
  console.log('Inizializzazione del database...');
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
  // await connection.query(`GRANT ALL PRIVILEGES ON ${dbConfig.database}.* TO '${dbConfig.user}'@'localhost';`);
  // await connection.query(`FLUSH PRIVILEGES;`);
  await connection.query(`USE \`${dbConfig.database}\`;`);
  await connection.end();

  const db = await mysql.createConnection(dbConfig);

  await db.query(`
    CREATE TABLE IF NOT EXISTS movies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      duration INT UNSIGNED NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      seats INT UNSIGNED NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS screenings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      id_movie INT NOT NULL,
      id_room INT NOT NULL,
      timecode DATETIME NOT NULL,
      available_seats INT NOT NULL,
      seats VARCHAR(255) NOT NULL,
      FOREIGN KEY (id_movie) REFERENCES movies(id) ON DELETE CASCADE,
      FOREIGN KEY (id_room) REFERENCES rooms(id) ON DELETE CASCADE,
      UNIQUE(id_room, timecode)
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      id_projection INT,
      user_id VARCHAR(64) NOT NULL,
      seats VARCHAR(255) NOT NULL,
      purchase_time DATETIME NOT NULL,
      FOREIGN KEY (id_projection) REFERENCES screenings(id) ON DELETE SET NULL,
      UNIQUE(id_projection, user_id, purchase_time)
    );
  `);
}

module.exports = { initDatabase, dbConfig };
