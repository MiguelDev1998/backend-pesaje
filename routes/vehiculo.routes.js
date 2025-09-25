const express = require('express');
const router = express.Router();
const connection = require('../models/db');

// Registrar vehículo con piloto_id
router.post('/', (req, res) => {
  const { numero_placa, tipo, piloto_id } = req.body;
if (!numero_placa || !piloto_id) {
  return res.status(400).json({ error: 'Número de placa y piloto_id son obligatorios' });
}


  const sql = `
    INSERT INTO vehiculo (numero_placa, tipo, piloto_id)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE tipo = VALUES(tipo), piloto_id = VALUES(piloto_id)
  `;

  connection.query(sql, [numero_placa, tipo || null, piloto_id], (err, result) => {
    if (err) {
      console.error('Error al registrar vehículo:', err);
      return res
        .status(500)
        .json({ error: 'Error al registrar vehículo', details: err });
    }

    // Si fue insertado, insertId
    if (result.insertId && result.insertId > 0) {
      return res.json({
        message: 'Vehículo registrado con éxito',
        id: result.insertId,
      });
    }

    //Si fue actualización, buscamos el id existente
    connection.query(
      'SELECT id FROM vehiculo WHERE numero_placa = ? LIMIT 1',
      [numero_placa],
      (err2, rows2) => {
        if (err2) {
          console.error('Error al obtener vehículo existente:', err2);
          return res.status(500).json({
            error: 'Error al obtener vehículo existente',
            details: err2,
          });
        }

        if (rows2.length === 0) {
          return res
            .status(404)
            .json({ error: 'Vehículo no encontrado después de actualizar' });
        }

        return res.json({
          message: 'Vehículo actualizado',
          id: rows2[0].id,
        });
      }
    );
  });
});

// Listar vehículos
router.get('/', (req, res) => {
  const sql = `
    SELECT v.id, v.numero_placa, v.tipo, p.nombre AS piloto, v.creado_en
    FROM vehiculo v
    LEFT JOIN pilotos p ON v.piloto_id = p.id
  `;
  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error al consultar vehículos:', err);
      return res
        .status(500)
        .json({ error: 'Error al consultar vehículos', details: err });
    }
    res.json(rows);
  });
});

module.exports = router;
