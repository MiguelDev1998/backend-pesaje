const db = require('../models/db');

exports.listar = (req, res) => {
  const query = `
    SELECT 
    r.id AS recibo_id,
    pa.partida AS numero_partida,
    r.fecha,

    -- 🔹 Código y nombre del proveedor
    CONCAT('PROV-', LPAD(c.id, 3, '0')) AS codigo,
    CONCAT(c.primer_nombre, ' ', c.primer_apellido) AS proveedor,

    -- 🔹 Datos del piloto y transporte (vehículo)
    pi.nombre AS piloto,
    v.numero_placa AS transporte,


    -- 🔹 Datos de la partida
   IFNULL(pa.producto, 'MADURO') AS tipo,
    '2025-2026' AS cosecha,


    -- 🔹 Datos del peso (tara y kilos)
    p.peso_bruto,
    p.tara_nylon AS saco_nylon,
    p.tara_yute AS saco_yute,
    (p.tara_nylon + p.tara_yute) AS tara,
    p.peso_neto AS peso_recibo,

    -- 🔹 Indicador de compra
    r.compra

FROM recibo r
INNER JOIN cliente c ON c.id = r.cliente_id
INNER JOIN partida pa ON pa.id = r.partida_id
INNER JOIN peso p ON p.id = r.peso_id
INNER JOIN piloto pi ON pi.id = p.piloto_id
INNER JOIN vehiculo v ON v.id = p.vehiculo_id
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

