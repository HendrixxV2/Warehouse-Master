// backend/app.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));

const { autenticar } = require('./middleware/auth');
app.use('/api', autenticar);

app.use('/api/productos',    require('./routes/productoRoutes'));
app.use('/api/movimientos',  require('./routes/movimientoStockRoutes'));
app.use('/api/pedidos',      require('./routes/pedidoRoutes'));
app.use('/api/detalles',     require('./routes/detallePedidoRoutes'));
app.use('/api/proveedores',  require('./routes/proveedorRoutes'));
app.use('/api/categorias',   require('./routes/categoriaRoutes'));
app.use('/api/almacenes',    require('./routes/almacenRoutes'));
app.use('/api/usuarios',     require('./routes/usuarioRoutes'));
app.use('/api/dashboard',    require('./routes/dashboardRoutes'));
app.use('/api',              require('./routes/extendedRoutes'));

module.exports = app;
