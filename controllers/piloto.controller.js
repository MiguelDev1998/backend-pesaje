// controllers/piloto.controller.js
const Piloto = require('../models/piloto.model');

exports.listar = (req, res) => {
  Piloto.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.obtener = (req, res) => {
  const { id } = req.params;
  Piloto.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};

exports.crear = (req, res) => {
  const data = req.body;
  Piloto.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '✅ Piloto agregado correctamente', id: result.insertId });
  });
};

exports.actualizar = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  Piloto.update(id, data, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '✏️ Piloto actualizado correctamente' });
  });
};

exports.eliminar = (req, res) => {
  const { id } = req.params;
  Piloto.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '🗑️ Piloto eliminado correctamente' });
  });
};
