const express = require('express');
const router = express.Router();
const db = require('../db'); // tu conexión a MySQL

// 🔹 Obtener todos los clientes
router.get('/', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener clientes:', err);
      res.status(500).json({ error: 'Error al obtener clientes' });
    } else {
      res.json(results);
    }
  });
});

// 🔹 Insertar cliente nuevo
router.post('/', (req, res) => {
  const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, dpi, direccion, telefono, correo } = req.body;
  
  const sql = `INSERT INTO clientes (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, dpi, direccion, telefono, correo)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
               
  db.query(sql, [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, dpi, direccion, telefono, correo], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar cliente:', err);
      res.status(500).json({ error: 'Error al insertar cliente' });
    } else {
      res.status(201).json({ id: result.insertId, message: '✅ Cliente agregado con éxito' });
    }
  });
});

module.exports = router;
