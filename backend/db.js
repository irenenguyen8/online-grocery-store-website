const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Database connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Qwerty123!',
    database: process.env.DB_NAME || 'grocery_store',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  db.getConnection()
    .then(connection => {
      console.log('Connected to MySQL database.');
      connection.release();
    })
    .catch(err => {
      console.error('Database connection failed:', err.stack);
    });

module.exports = db;
