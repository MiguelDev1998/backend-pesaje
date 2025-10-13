const db = require('../models/db');

exports.listar = (req, res) => {
  const query = `
    SELECT 
      r.id AS recibo_id,
      pa.partida AS numero_partida,   -- ✅ ahora muestra el número asignado, no el id
      r.fecha,
      CONCAT('PROV-', LPAD(r.cliente_id, 3, '0')) AS codigo,
      CONCAT(c.primer_nombre, ' ', c.primer_apellido) AS proveedor,
      r.saco_nylon,
      r.saco_yute,
      r.peso_recibo,
      r.compra
    FROM recibo r
    INNER JOIN cliente c ON c.id = r.cliente_id
    INNER JOIN partida pa ON pa.id = r.partida_id
    ORDER BY r.id DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(' Error al listar recibos:', err);
      return res.status(500).json({ message: 'Error al obtener los recibos', error: err });
    }
    res.json(results);
  });
};

