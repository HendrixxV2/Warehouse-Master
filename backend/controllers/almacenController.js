const { Almacen } = require('../models');
const { crearControladorRecurso } = require('./resourceController');

module.exports = crearControladorRecurso({
  model: Almacen,
  fields: ['nombre', 'ubicacion', 'capacidad'],
});
