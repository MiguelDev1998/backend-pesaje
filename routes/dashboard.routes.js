const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Total de café entregado (global)
router.get('/total-cafe', (req, res) => {
  const query = 'SELECT SUM(peso_neto) AS total FROM pesos';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener datos:', err);
      return res.status(500).json({ error: 'Error al obtener datos' });
    }

    const total = results[0]?.total ?? 0;
    res.json({ total });

  });

});

// Café entregado por mes
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
      console.error('Error al obtener datos por mes:', err);
      return res.status(500).json({ error: 'Error al obtener datos por mes' });
    }

    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Mapear resultados a nombres de meses
    const labels = results.map(r => meses[r.mes - 1]);
    const data = results.map(r => parseFloat(r.total));

    res.json({ labels, data });
  });
});

//Total café del día (fecha actual)
router.get('/total-dia', (req, res) => {
  const query = `
    SELECT SUM(peso_neto) AS total
    FROM peso
    WHERE DATE(fecha_pesaje) = CURDATE();
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener total del día:', err);
      return res.status(500).json({ error: 'Error al obtener total del día' });
    }

    const total = results[0]?.total ?? 0;
    res.json({ total });
  });
});

// Café entregado por tipo (según producto en partidas)
router.get('/cafe-por-tipo', (req, res) => {
  const query = `
    SELECT pa.producto AS tipo, SUM(p.peso_neto) AS total
    FROM peso p
    JOIN partida pa ON p.partida_id = pa.id
    GROUP BY pa.producto;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener café por tipo:', err);
      return res.status(500).json({ error: 'Error al obtener datos' });
    }
    res.json(results);
  });
});










module.exports = router;







