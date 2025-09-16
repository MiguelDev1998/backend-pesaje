const express = require('express');
const router = express.Router();
const connection = require('../models/db');

// Registrar vehículo con piloto
router.post('/', (req, res) => {
  const { numero_placa, tipo, piloto } = req.body;

  if (!numero_placa || !piloto) {
    return res.status(400).json({ error: 'Número de placa y piloto son obligatorios' });
  }

  // Buscar ID del piloto
  const getPilotoId = 'SELECT id FROM pilotos WHERE nombre = ? LIMIT 1';
  connection.query(getPilotoId, [piloto], (err, rows) => {
    if (err) {
      console.error('❌ Error al buscar piloto:', err);
      return res.status(500).json({ error: 'Error al buscar piloto', details: err });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Piloto no encontrado' });
    }

    const pilotoId = rows[0].id;

    // Insertar o actualizar vehículo
    const sql = `
      INSERT INTO vehiculos (numero_placa, tipo, piloto_id)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE tipo = VALUES(tipo), piloto_id = VALUES(piloto_id)
    `;

    connection.query(sql, [numero_placa, tipo || null, pilotoId], (err2, result) => {
      if (err2) {
        console.error('❌ Error al registrar vehículo:', err2);
        return res.status(500).json({ error: 'Error al registrar vehículo', details: err2 });
      }

      // ✅ Si fue insertado, devolvemos insertId
      if (result.insertId && result.insertId > 0) {
        return res.json({
          message: '✅ Vehículo registrado con éxito',
          id: result.insertId
        });
      }

      // ✅ Si fue actualización, buscamos el id existente
      connection.query(
        'SELECT id FROM vehiculos WHERE numero_placa = ? LIMIT 1',
        [numero_placa],
        (err3, rows2) => {
          if (err3) {
            console.error('❌ Error al obtener vehículo existente:', err3);
            return res.status(500).json({
              error: 'Error al obtener vehículo existente',
              details: err3
            });
          }

          if (rows2.length === 0) {
            return res
              .status(404)
              .json({ error: 'Vehículo no encontrado después de actualizar' });
          }

          return res.json({
            message: 'ℹ️ Vehículo actualizado',
            id: rows2[0].id
          });
        }
      );
    });
  });
});

// Listar vehículos
router.get('/', (req, res) => {
  const sql = `
    SELECT v.id, v.numero_placa, v.tipo, p.nombre AS piloto, v.creado_en
    FROM vehiculos v
    LEFT JOIN pilotos p ON v.piloto_id = p.id
  `;
  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('❌ Error al consultar vehículos:', err);
      return res.status(500).json({ error: 'Error al consultar vehículos', details: err });
    }
    res.json(rows);
  });
});

module.exports = router;
