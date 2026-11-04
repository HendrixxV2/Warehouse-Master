const { crearValidador, reglas } = require('./common');

const campos = {
  nombre: reglas.texto(150),
  email: reglas.email,
  telefono: reglas.textoOpcional(30),
  direccion: reglas.textoOpcional(255),
};

module.exports = {
  validarCrearProveedor: crearValidador({ required: ['nombre'], fields: campos }),
  validarActualizarProveedor: crearValidador({ fields: campos }),
};
