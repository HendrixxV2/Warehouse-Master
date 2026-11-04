const { crearValidador, reglas } = require('./common');

const campos = {
  fecha: reglas.fecha,
  estado: reglas.opcion(['pendiente', 'procesando', 'completado', 'cancelado']),
  id_usuario: reglas.entero(1),
};

module.exports = {
  validarCrearPedido: crearValidador({ required: ['id_usuario'], fields: campos }),
  validarActualizarPedido: crearValidador({
    fields: { fecha: campos.fecha, estado: campos.estado },
  }),
};
