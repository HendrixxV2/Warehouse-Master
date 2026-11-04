const { crearValidador, reglas } = require('./common');

const camposCrear = {
  tipo: reglas.opcion(['entrada', 'salida']),
  cantidad: reglas.entero(1),
  id_usuario: reglas.entero(1),
  id_producto: reglas.entero(1),
  fecha: reglas.fecha,
};

const camposActualizar = {
  tipo: camposCrear.tipo,
  cantidad: camposCrear.cantidad,
  fecha: camposCrear.fecha,
};

module.exports = {
  validarCrearMovimiento: crearValidador({
    required: ['tipo', 'cantidad', 'id_usuario', 'id_producto'],
    fields: camposCrear,
  }),
  validarActualizarMovimiento: crearValidador({ fields: camposActualizar }),
};