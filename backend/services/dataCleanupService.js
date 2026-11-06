// backend/services/dataCleanupService.js
const { MovimientoStock, Pedido, DetallePedido, sequelize } = require('../models');
const { Op } = require('sequelize');
const notifier = require('./notificationService');

const RETENTION_DAYS = 180;

async function run() {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  let removed = 0;

  // Pedidos cancelados hace más de X días
  removed += await Pedido.destroy({
    where: { estado: 'cancelado', fecha: { [Op.lt]: cutoff } },
  });

  // Movimientos huérfanos (producto ya eliminado)
  removed += await MovimientoStock.destroy({
    where: sequelize.literal(
      `id_producto NOT IN (SELECT id FROM productos)`
    ),
  });

  // Detalles sin pedido
  removed += await DetallePedido.destroy({
    where: sequelize.literal(
      `id_pedido NOT IN (SELECT id FROM pedidos)`
    ),
  });

  if (removed > 0) {
    await notifier.send({
      level: 'info',
      title: '🧹 Limpieza de datos',
      body: `Se eliminaron ${removed} registro(s) obsoleto(s) (retención: ${RETENTION_DAYS} días)`,
    });
  }

  return { removed };
}

module.exports = { run, RETENTION_DAYS };