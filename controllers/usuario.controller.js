const db = require('../models/db');
const bcrypt = require('bcrypt');

// Controlador para login
exports.login = (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
  }

  // B usuario en la base de datos
  const query = 'SELECT * FROM usuarios WHERE usuario = ?';
  db.query(query, [usuario], async (err, results) => {
    if (err) {
      console.error('Error en login:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const usuarioDB = results[0];

    // Compara contraseñas con bcrypt
    const match = await bcrypt.compare(password, usuarioDB.contrasena);
    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Solo devolve datos necesarios (no la contraseña)
    res.json({
      message: 'Login exitoso',
      usuario: {
        id: usuarioDB.id,
        usuario: usuarioDB.usuario,
        nombre: usuarioDB.nombre
      }
    });
  });
};
