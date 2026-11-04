const { crearValidador, reglas } = require('./common');

const camposCrear = {
  cantidad: reglas.entero(1),
  id_pedido: reglas.entero(1),
  id_producto: reglas.entero(1),
};

module.exports = {
  validarCrearDetalle: crearValidador({
    required: Object.keys(camposCrear),
    fields: camposCrear,
  }),
  validarActualizarDetalle: crearValidador({
    fields: { cantidad: camposCrear.cantidad },
  }),
};
