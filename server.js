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
const pilotoRoutes = require('./routes/piloto.routes');
const vehiculoRoutes = require('./routes/vehiculo.routes');
const pesosRoutes = require('./routes/pesos.routes');
const clientesRoutes = require('./routes/cliente.router');
const dashboardRoutes = require('./routes/dashboard.routes');



//endpoint 
app.use('/dashboard', dashboardRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/pesos', pesosRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/pilotos', pilotoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/partidas', partidaRoutes); 


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
