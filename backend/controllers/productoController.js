const { Producto, Proveedor, Categoria, Almacen } = require('../models');
const { crearControladorRecurso, responderError } = require('./resourceController');

const controlador = crearControladorRecurso({
  model: Producto,
  fields: ['nombre', 'precio', 'stock_actual', 'id_proveedor', 'id_categoria', 'id_almacen'],
  include: [
    { model: Proveedor, as: 'proveedor' },
    { model: Categoria, as: 'categoria' },
    { model: Almacen, as: 'almacen' },
  ],
});
const listarCompleto = controlador.listar;
const obtenerCompleto = controlador.obtener;

function esNoAdministrador(req) {
  return req.user?.rol !== 'admin';
}

controlador.listar = async (req, res) => {
  if (!esNoAdministrador(req)) return listarCompleto(req, res);

  try {
    const productos = await Producto.findAll({
      attributes: ['id', 'nombre', 'stock_actual', 'id_almacen'],
      order: [['id', 'ASC']],
    });
    return res.json(productos);
  } catch (error) {
    return responderError(res, error);
  }
};

controlador.obtener = async (req, res) => {
  if (!esNoAdministrador(req)) return obtenerCompleto(req, res);

  try {
    const producto = await Producto.findByPk(req.params.id, {
      attributes: ['id', 'nombre', 'stock_actual', 'id_almacen'],
    });
    if (!producto) return res.status(404).json({ error: 'Registro no encontrado.' });
    return res.json(producto);
  } catch (error) {
    return responderError(res, error);
  }
};

module.exports = controlador;
