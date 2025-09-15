const express = require('express');
const router = express.Router();
const connection = require('../models/db');

// Registrar vehículo (con piloto asociado)
router.post('/', (req, res) => {
  const { numero_placa, tipo, piloto_id } = req.body;

  const sql = `
    INSERT INTO vehiculos (numero_placa, tipo, piloto_id)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE tipo = VALUES(tipo), piloto_id = VALUES(piloto_id)
  `;

  connection.query(sql, [numero_placa, tipo, piloto_id], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar vehículo:', err);
      return res.status(500).json({ error: 'Error al registrar vehículo', details: err });
    }
    res.json({ message: '✅ Vehículo registrado con éxito', id: result.insertId });
  });
});

module.exports = router;
