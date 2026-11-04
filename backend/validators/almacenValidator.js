const { crearValidador, reglas } = require('./common');

const campos = {
  nombre: reglas.texto(150),
  ubicacion: reglas.textoOpcional(255),
  capacidad: reglas.entero(0),
};

module.exports = {
  validarCrearAlmacen: crearValidador({ required: ['nombre'], fields: campos }),
  validarActualizarAlmacen: crearValidador({ fields: campos }),
};
