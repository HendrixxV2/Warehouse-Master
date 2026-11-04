// backend/server.js
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL establecida');
    app.listen(PORT, () => console.log(`🚀 API Warehouse Master en http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ Error de conexión:', err));