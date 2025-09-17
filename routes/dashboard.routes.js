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

module.exports = router;
