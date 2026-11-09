const {
  Pedido,
  Usuario,
  DetallePedido,
  Producto,
  Paquete,
  sequelize,
} = require('../models');
const {
  crearControladorRecurso,
  responderError,
} = require('./resourceController');

const controlador = crearControladorRecurso({
  model: Pedido,
  fields: ['fecha', 'estado', 'id_usuario'],
  include: [
    { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email', 'rol'] },
    {
      model: DetallePedido,
      as: 'detalles',
      include: [{ model: Producto, as: 'producto' }],
    },
  ],
});

const listarCompleto = controlador.listar;
const obtenerCompleto = controlador.obtener;
const actualizarCompleto = controlador.actualizar;
const incluirOperador = [
  { model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] },
  {
    model: DetallePedido,
    as: 'detalles',
    attributes: ['id', 'id_pedido', 'id_producto', 'cantidad'],
    include: [{
      model: Producto,
      as: 'producto',
      attributes: ['id', 'nombre', 'stock_actual', 'id_almacen'],
    }],
  },
];

controlador.listar = async (req, res) => {
  if (req.user.rol !== 'operador') return listarCompleto(req, res);
  try {
    const pedidos = await Pedido.findAll({
      attributes: ['id', 'fecha', 'estado', 'id_usuario'],
      include: incluirOperador,
      order: [['id', 'ASC']],
    });
    return res.json(pedidos);
  } catch (error) {
    return responderError(res, error);
  }
};

controlador.obtener = async (req, res) => {
  if (req.user.rol !== 'operador') return obtenerCompleto(req, res);
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      attributes: ['id', 'fecha', 'estado', 'id_usuario'],
      include: incluirOperador,
    });
    if (!pedido) return res.status(404).json({ error: 'Registro no encontrado.' });
    return res.json(pedido);
  } catch (error) {
    return responderError(res, error);
  }
};

controlador.actualizar = async (req, res) => {
  if (req.user.rol !== 'operador') return actualizarCompleto(req, res);
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Registro no encontrado.' });
    await pedido.update({ estado: req.body.estado });
    const actualizado = await Pedido.findByPk(req.params.id, {
      attributes: ['id', 'fecha', 'estado', 'id_usuario'],
      include: incluirOperador,
    });
    return res.json(actualizado);
  } catch (error) {
    return responderError(res, error);
  }
};

controlador.eliminar = async (req, res) => {
  try {
    await sequelize.transaction(async (transaction) => {
      const pedido = await Pedido.findByPk(req.params.id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!pedido) {
        const error = new Error('Registro no encontrado.');
        error.status = 404;
        throw error;
      }

      await DetallePedido.destroy({
        where: { id_pedido: pedido.id },
        transaction,
      });
      await Paquete.destroy({
        where: { id_pedido: pedido.id },
        transaction,
      });
      await pedido.destroy({ transaction });
    });
    return res.status(204).send();
  } catch (error) {
    return responderError(res, error);
  }
};

module.exports = controlador;
