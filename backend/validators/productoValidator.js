const { crearValidador, reglas } = require('./common');

const campos = {
  nombre: reglas.texto(150),
  precio: reglas.decimal(0),
  stock_actual: reglas.entero(0),
  id_proveedor: reglas.entero(1),
  id_categoria: reglas.entero(1),
  id_almacen: reglas.entero(1),
};

module.exports = {
  validarCrearProducto: crearValidador({
    required: Object.keys(campos),
    fields: campos,
  }),
  validarActualizarProducto: crearValidador({ fields: campos }),
};
