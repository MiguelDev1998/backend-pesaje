const express = require('express');
const router = express.Router();
const connection = require('../db'); // 👈 asegúrate de que tu db.js use module.exports también

// Crear nueva partida
router.post('/', (req, res) => {
  const { partida, origen, bache, producto, proceso, responsable } = req.body;

  const sql = `
    INSERT INTO partidas (partida, origen, bache, producto, proceso, responsable)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(sql, [partida, origen, bache, producto, proceso, responsable], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar partida:', err);
      return res.status(500).json({ error: 'Error al crear partida', details: err });
    }
    res.json({ message: '✅ Partida creada con éxito', id: result.insertId });
  });
});

// Listar partidas
router.get('/', (req, res) => {
  connection.query('SELECT * FROM partidas', (err, rows) => {
    if (err) {
      console.error('❌ Error al consultar partidas:', err);
      return res.status(500).json({ error: 'Error al consultar partidas', details: err });
    }
    res.json(rows);
  });
});

module.exports = router;
