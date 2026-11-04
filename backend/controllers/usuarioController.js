const { Usuario } = require('../models');
const { crearControladorRecurso } = require('./resourceController');

module.exports = crearControladorRecurso({
  model: Usuario,
  fields: ['nombre', 'email', 'rol'],
});
