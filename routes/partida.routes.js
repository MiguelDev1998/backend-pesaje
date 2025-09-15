const express = require('express');
const router = express.Router();
const connection = require('../models/db');

// Crear nueva partida
router.post('/', (req, res) => {
  const { partida, origen, bache, producto, proceso, responsable } = req.body;

  const sql = `
    INSERT INTO partidas (partida, origen, bache, producto, proceso, responsable)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [partida, origen, bache, producto, proceso, responsable],
    (err, result) => {
      if (err) {
        console.error('❌ Error al insertar partida:', err);
        return res.status(500).json({ error: 'Error al crear partida', details: err });
      }
      res.json({ message: '✅ Partida creada con éxito', id: result.insertId });
    }
  );
});

// Listar partidas
router.get('/', (req, res) => {
  connection.query('SELECT * FROM partidas', (err, rows) => {
    if (err) {
      console.error('❌ Error al consultar partidas:', err);
      return res.status(500).json({ error: 'Error al consultar partidas', details: err });
    }

    // 👇 Normalizar cerrada como boolean (0 → false, 1 → true)
    const partidas = rows.map(p => ({
      ...p,
      cerrada: p.cerrada === 1
    }));

    res.json(partidas);
  });
});

// Borrar partida por ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM partidas WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('❌ Error al borrar partida:', err);
      return res.status(500).json({ error: 'Error al borrar partida', details: err });
    }
    res.json({ message: '🗑️ Partida eliminada correctamente' });
  });
});

// Cerrar turno o borrar si no tiene pesos
router.put('/:id/cerrar', (req, res) => {
  const { id } = req.params;

  // Verificar si la partida tiene pesos asociados
  connection.query('SELECT * FROM pesos WHERE partida_id = ?', [id], (err, rows) => {
    if (err) {
      console.error('❌ Error al verificar pesos:', err);
      return res.status(500).json({ error: 'Error al verificar pesos', details: err });
    }

    if (rows.length === 0) {
      // No tiene pesos → eliminar
      connection.query('DELETE FROM partidas WHERE id = ?', [id], (err2) => {
        if (err2) {
          console.error('❌ Error al borrar partida sin pesos:', err2);
          return res.status(500).json({ error: 'Error al borrar partida', details: err2 });
        }
        return res.json({ message: '🗑️ Partida eliminada porque no tenía pesos' });
      });
    } else {
      // Sí tiene pesos → marcar cerrada
      connection.query('UPDATE partidas SET cerrada = 1 WHERE id = ?', [id], (err3) => {
        if (err3) {
          console.error('❌ Error al cerrar partida:', err3);
          return res.status(500).json({ error: 'Error al cerrar partida', details: err3 });
        }
        return res.json({ message: '✅ Partida cerrada correctamente' });
      });
    }
  });
});

module.exports = router;
