const mysql = require('mysql2');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '-06:00' // 🇬🇹 Ajuste para Guatemala
});

// Prueba de conexión 
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
    connection.release(); // Liberar conexión
  }
});

module.exports = pool;
