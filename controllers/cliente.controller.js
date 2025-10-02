const Cliente = require('../models/cliente.model');

exports.listar = (req, res) => {
  Cliente.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.obtener = (req, res) => {
  const { id } = req.params;
  Cliente.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};

exports.crear = (req, res) => {
  const data = req.body;
  Cliente.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: ' Cliente agregado correctamente', id: result.insertId });
  });
};

exports.actualizar = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  Cliente.update(id, data, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '✏️ Cliente actualizado correctamente' });
  });
};

exports.eliminar = (req, res) => {
  const { id } = req.params;
  Cliente.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: '🗑️ Cliente eliminado correctamente' });
  });
};
