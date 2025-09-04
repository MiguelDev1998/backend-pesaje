const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // Asegúrate de tenerlo en el .env si usas Railway
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prueba de conexión (opcional)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err);
  } else {
    console.log('✅ Conexión exitosa a la base de datos MySQL');
    connection.release(); // Muy importante liberar la conexión
  }
});

module.exports = pool;
