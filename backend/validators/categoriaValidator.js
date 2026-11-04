const { crearValidador, reglas } = require('./common');

const campos = {
  nombre: reglas.texto(100),
  descripcion: reglas.textoOpcional(65535),
};

module.exports = {
  validarCrearCategoria: crearValidador({ required: ['nombre'], fields: campos }),
  validarActualizarCategoria: crearValidador({ fields: campos }),
};
