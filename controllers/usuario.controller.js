const db = require('../models/db');

// Controlador para login
exports.login = (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
  }

  const query = 'SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?';
  db.query(query, [usuario, password], (err, results) => {
    if (err) {
      console.error('❌ Error al hacer login:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Opcional: aquí podrías generar un token si luego quieres autenticación JWT

    res.json({ message: 'Login exitoso', usuario: results[0] });
  });
};
