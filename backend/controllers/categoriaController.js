const { Categoria } = require('../models');
const { crearControladorRecurso } = require('./resourceController');

module.exports = crearControladorRecurso({
  model: Categoria,
  fields: ['nombre', 'descripcion'],
});
