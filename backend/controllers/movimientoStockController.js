// backend/controllers/movimientoStockController.js
const { MovimientoStock, Producto, sequelize } = require('../models');

exports.listar = async (_req, res) => {
  try {
    const movimientos = await MovimientoStock.findAll({
      include: [{ model: Producto, as: 'producto', attributes: ['id', 'nombre'] }],
      order: [['fecha', 'DESC']],
    });
    res.json(movimientos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.obtener = async (req, res) => {
  try {
    const mov = await MovimientoStock.findByPk(req.params.id);
    if (!mov) return res.status(404).json({ error: 'Movimiento no encontrado' });
    res.json(mov);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.crear = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { tipo, cantidad, id_usuario, id_producto, fecha } = req.body;

    const producto = await Producto.findByPk(id_producto, { transaction: t });
    if (!producto) {
      await t.rollback();
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const delta = tipo === 'entrada' ? cantidad : -cantidad;
    const nuevoStock = producto.stock_actual + delta;
    if (nuevoStock < 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Stock insuficiente para realizar la salida' });
    }

    const movimiento = await MovimientoStock.create(
      { tipo, cantidad, id_usuario, id_producto, fecha: fecha || new Date() },
      { transaction: t }
    );
    await producto.update({ stock_actual: nuevoStock }, { transaction: t });

    await t.commit();
    res.status(201).json(movimiento);
  } catch (e) {
    await t.rollback();
    res.status(500).json({ error: e.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const mov = await MovimientoStock.findByPk(req.params.id);
    if (!mov) return res.status(404).json({ error: 'Movimiento no encontrado' });
    await mov.update(req.body);
    res.json(mov);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const mov = await MovimientoStock.findByPk(req.params.id);
    if (!mov) return res.status(404).json({ error: 'Movimiento no encontrado' });
    await mov.destroy();
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};