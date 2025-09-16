const express = require('express');
const router = express.Router();
const connection = require('../models/db');

// Guardar registros de pesos
router.post('/', (req, res) => {
  const { partidaId, pilotoId, vehiculoId, registros } = req.body;

  console.log("📥 Body recibido:", req.body);

  // Validación fuerte
  if (partidaId == null || pilotoId == null || vehiculoId == null || !Array.isArray(registros) || registros.length === 0) {
    return res.status(400).json({ error: 'Faltan datos: partidaId, pilotoId, vehiculoId o registros' });
  }

  const sql = `
    INSERT INTO pesos (partida_id, piloto_id, vehiculo_id, peso_bruto, tara_nylon, tara_yute, peso_neto, fecha_pesaje)
    VALUES ?
  `;

  const values = registros.map(r => [
    partidaId,
    pilotoId,
    vehiculoId,
    parseFloat(r.pesoBruto),
    parseFloat(r.taraNylon),
    parseFloat(r.taraYute),
    parseFloat(r.pesoNeto),
    new Date()
  ]);

  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.error('❌ Error al guardar pesos:', err);
      return res.status(500).json({ error: 'Error al guardar pesos', details: err });
    }
    res.json({ message: '✅ Pesos registrados con éxito', inserted: result.affectedRows });
  });
});

// Listar pesos con JOINs
router.get('/detalle/:partidaId', (req, res) => {
  const { partidaId } = req.params;

  const sql = `
    SELECT p.id, p.peso_bruto, p.tara_nylon, p.tara_yute, p.peso_neto, p.fecha_pesaje,
           v.numero_placa, pil.nombre AS piloto, pa.partida
    FROM pesos p
    INNER JOIN vehiculos v ON p.vehiculo_id = v.id
    INNER JOIN pilotos pil ON p.piloto_id = pil.id
    INNER JOIN partidas pa ON p.partida_id = pa.id
    WHERE p.partida_id = ?
    ORDER BY p.fecha_pesaje DESC
  `;

  connection.query(sql, [partidaId], (err, rows) => {
    if (err) {
      console.error('❌ Error al obtener detalle de pesos:', err);
      return res.status(500).json({ error: 'Error al obtener detalle de pesos', details: err });
    }
    res.json(rows);
  });
});

module.exports = router;
