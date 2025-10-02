// models/piloto.model.js
const db = require('./db');

const Piloto = {
  getAll: (callback) => {
    db.query('SELECT * FROM piloto', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM piloto WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query('INSERT INTO piloto (nombre, licencia, telefono) VALUES (?, ?, ?)', 
      [data.nombre, data.licencia, data.telefono], callback);
  },

  update: (id, data, callback) => {
    db.query(
      'UPDATE piloto SET nombre = ?, licencia = ?, telefono = ? WHERE id = ?', 
      [data.nombre, data.licencia, data.telefono, id], callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM piloto WHERE id = ?', [id], callback);
  }
};

module.exports = Piloto;
