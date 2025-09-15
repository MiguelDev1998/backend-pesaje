const express = require('express');
const router = express.Router();
const connection = require('../models/db');

// Registrar vehículo con piloto
router.post('/', (req, res) => {
  const { numero_placa, tipo, piloto } = req.body;

  if (!numero_placa || !piloto) {
    return res.status(400).json({ error: 'Número de placa y piloto son obligatorios' });
  }

  // Insertar vehículo asociado al nombre del piloto
  const sql = `
    INSERT INTO vehiculos (numero_placa, tipo, piloto_id)
    VALUES (?, ?, (SELECT id FROM pilotos WHERE nombre = ? LIMIT 1))
    ON DUPLICATE KEY UPDATE tipo = VALUES(tipo), piloto_id = (SELECT id FROM pilotos WHERE nombre = ? LIMIT 1)
  `;

  connection.query(sql, [numero_placa, tipo || null, piloto, piloto], (err, result) => {
    if (err) {
      console.error('❌ Error al registrar vehículo:', err);
      return res.status(500).json({ error: 'Error al registrar vehículo', details: err });
    }
    res.json({ message: '✅ Vehículo registrado con éxito', id: result.insertId });
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
