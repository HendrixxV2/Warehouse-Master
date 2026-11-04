const { Pedido, Usuario, DetallePedido, Producto } = require('../models');
const { crearControladorRecurso } = require('./resourceController');

module.exports = crearControladorRecurso({
  model: Pedido,
  fields: ['fecha', 'estado', 'id_usuario'],
  include: [
    { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email', 'rol'] },
    {
      model: DetallePedido,
      as: 'detalles',
      include: [{ model: Producto, as: 'producto' }],
    },
  ],
});
