const express = require('express');
const router = express.Router();
const connection = require('../models/db');

// Crear nueva partida (siempre entra como abierta: cerrada = 0)
router.post('/', (req, res) => {
  const { partida, origen, bache, producto, proceso, responsable } = req.body;

  const sql = `
    INSERT INTO partidas (partida, origen, bache, producto, proceso, responsable, cerrada)
    VALUES (?, ?, ?, ?, ?, ?, 0)
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

    // Normalizar cerrada como boolean (0, '0' → false | 1, '1' → true)
    const partidas = rows.map(p => ({
      ...p,
      cerrada: p.cerrada == 1
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

// Alternar turno (cerrar ↔ abrir)
router.put('/:id/cerrar', (req, res) => {
  const { id } = req.params;

  // Verificar estado actual
  connection.query('SELECT cerrada FROM partidas WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error al consultar partida:', err);
      return res.status(500).json({ error: 'Error al consultar partida', details: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Partida no encontrada' });
    }

    const estadoActual = result[0].cerrada;

    if (estadoActual == 1) {
      // 🔓 Si está cerrada → abrir (cerrada = 0)
      connection.query('UPDATE partidas SET cerrada = 0 WHERE id = ?', [id], (err2) => {
        if (err2) {
          console.error('❌ Error al abrir partida:', err2);
          return res.status(500).json({ error: 'Error al abrir partida', details: err2 });
        }
        return res.json({ message: '🔓 Partida reabierta correctamente' });
      });
    } else {
      // 🔒 Si está abierta → cerrar (cerrada = 1)
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
