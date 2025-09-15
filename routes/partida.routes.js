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

// Alternar turno (cerrar/abrir) o borrar si no tiene pesos
router.put('/:id/cerrar', (req, res) => {
  const { id } = req.params;

  // Verificar estado actual de la partida
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
      // 🔓 Si está cerrada → reabrir
      connection.query('UPDATE partidas SET cerrada = 0 WHERE id = ?', [id], (err2) => {
        if (err2) {
          console.error('❌ Error al abrir partida:', err2);
          return res.status(500).json({ error: 'Error al abrir partida', details: err2 });
        }
        return res.json({ message: '🔓 Partida reabierta correctamente' });
      });
    } else {
      // 🔒 Si está abierta → verificamos si tiene pesos
      connection.query('SELECT * FROM pesos WHERE partida_id = ?', [id], (err3, rows) => {
        if (err3) {
          console.error('❌ Error al verificar pesos:', err3);
          return res.status(500).json({ error: 'Error al verificar pesos', details: err3 });
        }

        if (rows.length === 0) {
          // No tiene pesos → eliminar
          connection.query('DELETE FROM partidas WHERE id = ?', [id], (err4) => {
            if (err4) {
              console.error('❌ Error al borrar partida sin pesos:', err4);
              return res.status(500).json({ error: 'Error al borrar partida', details: err4 });
            }
            return res.json({ message: '🗑️ Partida eliminada porque no tenía pesos' });
          });
        } else {
          // Tiene pesos → cerrar
          connection.query('UPDATE partidas SET cerrada = 1 WHERE id = ?', [id], (err5) => {
            if (err5) {
              console.error('❌ Error al cerrar partida:', err5);
              return res.status(500).json({ error: 'Error al cerrar partida', details: err5 });
            }
            return res.json({ message: '✅ Partida cerrada correctamente' });
          });
        }
      });
    }
  });
});

module.exports = router;
