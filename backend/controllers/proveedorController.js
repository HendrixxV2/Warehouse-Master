const { Proveedor } = require('../models');
const { crearControladorRecurso } = require('./resourceController');

module.exports = crearControladorRecurso({
  model: Proveedor,
  fields: ['nombre', 'email', 'telefono', 'direccion'],
});
