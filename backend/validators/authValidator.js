const { crearValidador, reglas } = require('./common');

const camposRegistro = {
  nombre: reglas.texto(150),
  email: reglas.email,
  password: reglas.password,
};

const camposLogin = {
  email: reglas.email,
  password: reglas.password,
};

module.exports = {
  validarRegistro: crearValidador({ required: ['nombre', 'email', 'password'], fields: camposRegistro }),
  validarLogin: crearValidador({ required: ['email', 'password'], fields: camposLogin }),
};