const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const usuarioRoutes = require('./routes/usuario.routes');
const partidaRoutes = require('./routes/partida.routes');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/partidas', partidaRoutes); //endpoint para partidas

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor backend escuchando en el puerto ${PORT}`);
});
