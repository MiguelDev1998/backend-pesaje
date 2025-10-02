const db = require('./db');

const Cliente = {
  getAll: (callback) => {
    db.query('SELECT * FROM cliente', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM cliente WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query(
      `INSERT INTO cliente 
       (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, dpi, direccion, telefono, correo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.primer_nombre, data.segundo_nombre, data.primer_apellido, data.segundo_apellido, data.dpi, data.direccion, data.telefono, data.correo],
      callback
    );
  },

  update: (id, data, callback) => {
    db.query(
      `UPDATE cliente 
       SET primer_nombre=?, segundo_nombre=?, primer_apellido=?, segundo_apellido=?, dpi=?, direccion=?, telefono=?, correo=? 
       WHERE id=?`,
      [data.primer_nombre, data.segundo_nombre, data.primer_apellido, data.segundo_apellido, data.dpi, data.direccion, data.telefono, data.correo, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM cliente WHERE id = ?', [id], callback);
  }
};

module.exports = Cliente;
