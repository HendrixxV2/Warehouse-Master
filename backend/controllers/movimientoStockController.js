const { MovimientoStock, Producto, sequelize } = require('../models');
const { responderError } = require('./resourceController');

exports.listar = async (_req, res) => {
  try {
    const movimientos = await MovimientoStock.findAll({
      include: [{ model: Producto, as: 'producto', attributes: ['id', 'nombre'] }],
      order: [['fecha', 'DESC']],
    });
    return res.json(movimientos);
  } catch (e) {
    return responderError(res, e);
  }
};

exports.obtener = async (req, res) => {
  try {
    const mov = await MovimientoStock.findByPk(req.params.id, {
      include: [{ model: Producto, as: 'producto', attributes: ['id', 'nombre'] }],
    });
    if (!mov) return res.status(404).json({ error: 'Movimiento no encontrado' });
    return res.json(mov);
  } catch (e) {
    return responderError(res, e);
  }
};

exports.crear = async (req, res) => {
  try {
    const { tipo, cantidad, id_usuario, id_producto, fecha } = req.body;
    const movimiento = await sequelize.transaction(async (transaction) => {
      const producto = await Producto.findByPk(id_producto, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!producto) {
        const error = new Error('Producto no encontrado.');
        error.status = 404;
        throw error;
      }

      const delta = tipo === 'entrada' ? cantidad : -cantidad;
      const nuevoStock = producto.stock_actual + delta;
      if (nuevoStock < 0) {
        const error = new Error('Stock insuficiente para realizar la salida.');
        error.status = 400;
        throw error;
      }

      await producto.update({ stock_actual: nuevoStock }, { transaction });
      return MovimientoStock.create(
        { tipo, cantidad, id_usuario, id_producto, fecha: fecha || new Date() },
        { transaction }
      );
    });
    return res.status(201).json(movimiento);
  } catch (e) {
    return responderError(res, e);
  }
};

exports.actualizar = async (req, res) => {
  try {
    const mov = await sequelize.transaction(async (transaction) => {
      const movimiento = await MovimientoStock.findByPk(req.params.id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!movimiento) {
        const error = new Error('Movimiento no encontrado.');
        error.status = 404;
        throw error;
      }

      const producto = await Producto.findByPk(movimiento.id_producto, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!producto) {
        const error = new Error('Producto asociado al movimiento no encontrado.');
        error.status = 404;
        throw error;
      }
      const stockActual = producto.stock_actual - aplicarDelta(movimiento);
      const tipo = req.body.tipo || movimiento.tipo;
      const cantidad = req.body.cantidad === undefined ? movimiento.cantidad : req.body.cantidad;
      const nuevoStock = stockActual + aplicarDelta({ tipo, cantidad });

      if (nuevoStock < 0) {
        const error = new Error('Stock insuficiente para actualizar el movimiento.');
        error.status = 400;
        throw error;
      }

      await producto.update({ stock_actual: nuevoStock }, { transaction });
      await movimiento.update(req.body, { transaction });
      return movimiento;
    });
    return res.json(mov);
  } catch (e) {
    return responderError(res, e);
  }
};

exports.eliminar = async (req, res) => {
  try {
    await sequelize.transaction(async (transaction) => {
      const movimiento = await MovimientoStock.findByPk(req.params.id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!movimiento) {
        const error = new Error('Movimiento no encontrado.');
        error.status = 404;
        throw error;
      }

      const producto = await Producto.findByPk(movimiento.id_producto, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!producto) {
        const error = new Error('Producto asociado al movimiento no encontrado.');
        error.status = 404;
        throw error;
      }
      const nuevoStock = producto.stock_actual - aplicarDelta(movimiento);
      if (nuevoStock < 0) {
        const error = new Error('No se puede eliminar el movimiento porque dejaría el stock en negativo.');
        error.status = 409;
        throw error;
      }

      await producto.update({ stock_actual: nuevoStock }, { transaction });
      await movimiento.destroy({ transaction });
    });
    return res.status(204).send();
  } catch (e) {
    return responderError(res, e);
  }
};

function aplicarDelta(movimiento) {
  return movimiento.tipo === 'entrada' ? movimiento.cantidad : -movimiento.cantidad;
}