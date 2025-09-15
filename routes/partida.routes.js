// Cerrar turno o eliminar partida si no tiene pesos
router.put('/:id/cerrar', (req, res) => {
  const { id } = req.params;

  // 1. Verificamos si la partida tiene pesos
  pool.query('SELECT * FROM pesos WHERE partida_id = ?', [id], (err, rows) => {
    if (err) {
      console.error('❌ Error al verificar pesos:', err);
      return res.status(500).json({ error: 'Error al verificar pesos', details: err });
    }

    if (rows.length === 0) {
      // 2. No tiene pesos → la borramos
      pool.query('DELETE FROM partidas WHERE id = ?', [id], (err2, result) => {
        if (err2) {
          console.error('❌ Error al borrar partida:', err2);
          return res.status(500).json({ error: 'Error al borrar partida', details: err2 });
        }
        return res.json({ message: '🗑️ Partida eliminada porque no tenía pesos' });
      });
    } else {
      // 3. Sí tiene pesos → la cerramos
      pool.query('UPDATE partidas SET cerrada = 1 WHERE id = ?', [id], (err3, result) => {
        if (err3) {
          console.error('❌ Error al cerrar partida:', err3);
          return res.status(500).json({ error: 'Error al cerrar partida', details: err3 });
        }
        return res.json({ message: '✅ Partida cerrada correctamente' });
      });
    }
  });
});
