const {
  DetallePedido,
  Pedido,
  Producto,
  sequelize,
} = require('../models');
const { responderError } = require('./resourceController');

const include = [
  { model: Producto, as: 'producto' },
  { model: Pedido, as: 'pedido' },
];

exports.listar = async (_req, res) => {
  try {
    return res.json(await DetallePedido.findAll({ include, order: [['id', 'ASC']] }));
  } catch (error) {
    return responderError(res, error);
  }
};

exports.obtener = async (req, res) => {
  try {
    const detalle = await DetallePedido.findByPk(req.params.id, { include });
    if (!detalle) return res.status(404).json({ error: 'Detalle de pedido no encontrado.' });
    return res.json(detalle);
  } catch (error) {
    return responderError(res, error);
  }
};

exports.crear = async (req, res) => {
  try {
    const detalle = await sequelize.transaction(async (transaction) => {
      const [pedido, producto] = await Promise.all([
        Pedido.findByPk(req.body.id_pedido, { transaction, lock: transaction.LOCK.UPDATE }),
        Producto.findByPk(req.body.id_producto, { transaction }),
      ]);
      if (!pedido) throw crearError(404, 'Pedido no encontrado.');
      if (!producto) throw crearError(404, 'Producto no encontrado.');

      const precioUnitario = Number(producto.precio);
      const nuevoDetalle = await DetallePedido.create({
        id_pedido: pedido.id,
        id_producto: producto.id,
        cantidad: req.body.cantidad,
        precio_unitario: precioUnitario,
        subtotal: redondear(precioUnitario * req.body.cantidad),
      }, { transaction });
      await recalcularTotal(pedido, transaction);
      return nuevoDetalle;
    });
    return res.status(201).json(await detalle.reload({ include }));
  } catch (error) {
    return responderError(res, error);
  }
};

exports.actualizar = async (req, res) => {
  try {
    const id = req.params.id;
    await sequelize.transaction(async (transaction) => {
      const detalle = await DetallePedido.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!detalle) throw crearError(404, 'Detalle de pedido no encontrado.');

      const pedido = await Pedido.findByPk(detalle.id_pedido, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!pedido) throw crearError(404, 'Pedido asociado al detalle no encontrado.');
      const subtotal = redondear(Number(detalle.precio_unitario) * req.body.cantidad);
      await detalle.update({
        cantidad: req.body.cantidad,
        subtotal,
      }, { transaction });
      await recalcularTotal(pedido, transaction);
    });
    return res.json(await DetallePedido.findByPk(id, { include }));
  } catch (error) {
    return responderError(res, error);
  }
};

exports.eliminar = async (req, res) => {
  try {
    await sequelize.transaction(async (transaction) => {
      const detalle = await DetallePedido.findByPk(req.params.id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!detalle) throw crearError(404, 'Detalle de pedido no encontrado.');

      const pedido = await Pedido.findByPk(detalle.id_pedido, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!pedido) throw crearError(404, 'Pedido asociado al detalle no encontrado.');
      await detalle.destroy({ transaction });
      await recalcularTotal(pedido, transaction);
    });
    return res.status(204).send();
  } catch (error) {
    return responderError(res, error);
  }
};

async function recalcularTotal(pedido, transaction) {
  const detalles = await DetallePedido.findAll({
    where: { id_pedido: pedido.id },
    attributes: ['subtotal'],
    transaction,
  });
  const total = redondear(
    detalles.reduce((sum, detalle) => sum + Number(detalle.subtotal), 0)
  );
  await pedido.update({ total }, { transaction });
}

function redondear(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function crearError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}
