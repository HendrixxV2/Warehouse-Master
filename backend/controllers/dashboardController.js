const { Op } = require('sequelize');
const { Producto, Pedido, MovimientoStock } = require('../models');

exports.resumen = async (_req, res) => {
  try {
    const [totalProductos, stockResult, stockBajo, pedidosPendientes, movimientosRecientes, productosBajos] = await Promise.all([
      Producto.count(),
      Producto.sum('stock_actual'),
      Producto.count({ where: { stock_actual: { [Op.lt]: 10 } } }),
      Pedido.count({ where: { estado: { [Op.in]: ['pendiente', 'procesando'] } } }),
      MovimientoStock.findAll({
        include: [{ model: Producto, as: 'producto', attributes: ['id', 'nombre'] }],
        order: [['fecha', 'DESC']],
        limit: 50,
      }),
      Producto.findAll({
        where: { stock_actual: { [Op.lt]: 10 } },
        attributes: ['id', 'nombre', 'stock_actual'],
        order: [['stock_actual', 'ASC'], ['nombre', 'ASC']],
        limit: 10,
      }),
    ]);

    return res.json({
      totalProductos,
      stockTotal: Number(stockResult || 0),
      stockBajo,
      pedidosPendientes,
      movimientosRecientes,
      productosBajos,
    });
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo cargar el resumen del almacén.' });
  }
};
