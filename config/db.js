const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Buat connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kita export 'promise' version dari pool ini
// biar bisa pake async/await
module.exports = pool.promise();