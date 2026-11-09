const { crearValidador, reglas } = require('./common');

const campos = {
  nombre: reglas.texto(150),
  email: reglas.email,
  rol: reglas.opcion(['admin', 'supervisor', 'operador']),
};

module.exports = {
  validarCrearUsuario: crearValidador({
    required: ['nombre', 'email', 'password'],
    fields: { ...campos, password: reglas.password },
  }),
  validarActualizarUsuario: crearValidador({ fields: campos }),
};
