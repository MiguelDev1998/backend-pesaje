const express = require('express');
const router = express.Router();
const db = require('../models/db');

// 🔹 Total de café entregado (global)
router.get('/total-cafe', (req, res) => {
  const query = 'SELECT SUM(peso_neto) AS total FROM pesos';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener datos:', err);
      return res.status(500).json({ error: 'Error al obtener datos' });
    }

    const total = results[0]?.total ?? 0;
    res.json({ total });

  });
});

// 🔹 Café entregado por mes
router.get('/cafe-por-mes', (req, res) => {
  const query = `
    SELECT 
      MONTH(fecha_pesaje) AS mes, 
      SUM(peso_neto) AS total
    FROM pesos
    GROUP BY mes
    ORDER BY mes;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener datos por mes:', err);
      return res.status(500).json({ error: 'Error al obtener datos por mes' });
    }

    // 🔹 Formatear datos para el frontend
    const labels = results.map(r => `Mes ${r.mes}`);
    const data = results.map(r => parseFloat(r.total));

    res.json({ labels, data });
  });
});

module.exports = router;






module.exports = router;
