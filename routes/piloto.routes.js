const express = require('express');
const router = express.Router();
const connection = require('../models/db');
const pilotoController = require('../controllers/piloto.controller');


/*Listar todos los pilotos
router.get('/', (req, res) => {
  connection.query('SELECT id, nombre FROM piloto', (err, rows) => {
    if (err) {
      console.error('Error al consultar piloto:', err);
      return res.status(500).json({ error: 'Error al consultar piloto', details: err });
    }
    res.json(rows);
  });
});*/

// Rutas para CRUD de pilotos
router.get('/', pilotoController.listar);
router.get('/:id', pilotoController.obtener);
router.post('/', pilotoController.crear);
router.put('/:id', pilotoController.actualizar);
router.delete('/:id', pilotoController.eliminar);

module.exports = router;
