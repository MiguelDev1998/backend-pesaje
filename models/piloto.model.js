// models/piloto.model.js
const db = require('./db');

const Piloto = {
  getAll: (callback) => {
    db.query('SELECT * FROM pilotos', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM pilotos WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query('INSERT INTO pilotos (nombre, licencia, telefono) VALUES (?, ?, ?)', 
      [data.nombre, data.licencia, data.telefono], callback);
  },

  update: (id, data, callback) => {
    db.query(
      'UPDATE pilotos SET nombre = ?, licencia = ?, telefono = ? WHERE id = ?', 
      [data.nombre, data.licencia, data.telefono, id], callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM pilotos WHERE id = ?', [id], callback);
  }
};

module.exports = Piloto;
