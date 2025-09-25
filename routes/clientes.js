const express = require('express');
const router = express.Router();
const db = require('../models/db'); 

// para obtener todos los clientes
router.get('/', (req, res) => {
  db.query('SELECT * FROM cliente', (err, results) => {
    if (err) {
      console.error('Error al obtener cliente:', err);
      res.status(500).json({ error: 'Error al obtener cliente' });
    } else {
      res.json(results);
    }
  });
});

// insertar cliente nuevo
router.post('/', (req, res) => {
  const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, dpi, direccion, telefono, correo } = req.body;
  
  const sql = `INSERT INTO cliente (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, dpi, direccion, telefono, correo)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
               
  db.query(sql, [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, dpi, direccion, telefono, correo], (err, result) => {
    if (err) {
      console.error('Error al insertar cliente:', err);
      res.status(500).json({ error: 'Error al insertar cliente' });
    } else {
      res.status(201).json({ id: result.insertId, message: 'Cliente agregado correctamente' });
    }
  });
});

module.exports = router;
