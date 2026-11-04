const { Producto, Proveedor, Categoria, Almacen } = require('../models');
const { crearControladorRecurso } = require('./resourceController');

module.exports = crearControladorRecurso({
  model: Producto,
  fields: ['nombre', 'precio', 'stock_actual', 'id_proveedor', 'id_categoria', 'id_almacen'],
  include: [
    { model: Proveedor, as: 'proveedor' },
    { model: Categoria, as: 'categoria' },
    { model: Almacen, as: 'almacen' },
  ],
});
