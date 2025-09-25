const express = require('express');
const router = express.Router();
const connection = require('../models/db');

// Guardar pesos consolidados
router.post('/', (req, res) => {
  const { partidaId, pilotoId, vehiculoId, registros } = req.body;

  console.log("Body recibido:", req.body);

  // Validación fuerte
  if (
    partidaId == null || 
    pilotoId == null || 
    vehiculoId == null || 
    !Array.isArray(registros) || 
    registros.length === 0
  ) {
    return res.status(400).json({ error: 'Faltan datos: partidaId, pilotoId, vehiculoId o registros' });
  }
  
  
  // Consolidar los registros
  let totalBruto = 0;
  let totalNylon = 0;
  let totalYute = 0;
  let totalNeto = 0;
  let clienteId = registros[0].clienteId || null;  


  registros.forEach(r => {
    totalBruto += parseFloat(r.pesoBruto);
    totalNylon += parseFloat(r.taraNylon);
    totalYute  += parseFloat(r.taraYute);
    totalNeto  += parseFloat(r.pesoNeto);
    
  });

// Debug de lo que se va a insertar
  console.log("Consolidado listo para guardar:", {
    partidaId,
    pilotoId,
    vehiculoId,
    totalBruto,
    totalNylon,
    totalYute,
    totalNeto,
    clienteId
  });



  const sql = `
    INSERT INTO peso (
      partida_id, piloto_id, vehiculo_id, peso_bruto, tara_nylon, tara_yute, peso_neto, fecha_pesaje, cliente_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
  `;

  
  const values = [
    partidaId,
    pilotoId,
    vehiculoId,
    totalBruto.toFixed(2),
    totalNylon.toFixed(2),
    totalYute.toFixed(2),
    totalNeto.toFixed(2),
    clienteId
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al guardar peso:', err);
      return res.status(500).json({ error: 'Error al guardar peso', details: err });
    }
    res.json({ message: 'Pesos consolidados guardados con éxito', id: result.insertId });
  });
});

// Listar pesos 
router.get('/detalle/:partidaId', (req, res) => {
  const { partidaId } = req.params;

  const sql = `
    SELECT p.id, p.peso_bruto, p.tara_nylon, p.tara_yute, p.peso_neto, p.fecha_pesaje,
           v.numero_placa, pil.nombre AS piloto, pa.partida, c.primer_nombre, c.primer_apellido
    FROM peso p
    INNER JOIN vehiculo v ON p.vehiculo_id = v.id
    INNER JOIN piloto pil ON p.piloto_id = pil.id
    INNER JOIN partida pa ON p.partida_id = pa.id
    LEFT JOIN cliente c ON p.cliente_id = c.id
    WHERE p.partida_id = ?
    ORDER BY p.fecha_pesaje DESC
  `;

  connection.query(sql, [partidaId], (err, rows) => {
    if (err) {
      console.error('Error al obtener detalle de peso:', err);
      return res.status(500).json({ error: 'Error al obtener detalle de peso', details: err });
    }
    res.json(rows);
  });
});

module.exports = router;

