const express = require('express');
const router = express.Router();
const connection = require('../models/db');

// Listar todos los pilotos
router.get('/', (req, res) => {
  connection.query('SELECT id, nombre FROM pilotos', (err, rows) => {
    if (err) {
      console.error('❌ Error al consultar pilotos:', err);
      return res.status(500).json({ error: 'Error al consultar pilotos', details: err });
    }
    res.json(rows);
  });
});

module.exports = router;
