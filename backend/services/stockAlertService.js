// backend/services/stockAlertService.js
const { Producto } = require('../models');
const { Op } = require('sequelize');
const notifier = require('./notificationService');

const THRESHOLD = 10;

async function run() {
  const lowStock = await Producto.findAll({
    where: { stock_actual: { [Op.lt]: THRESHOLD } },
    attributes: ['id', 'nombre', 'stock_actual'],
    order: [['stock_actual', 'ASC']],
  });

  if (!lowStock.length) return { checked: true, alerts: 0 };

  const body = lowStock
    .slice(0, 15)
    .map((p) => `• ${p.nombre} — ${p.stock_actual} uds`)
    .join('\n');

  await notifier.send({
    level: 'warning',
    title: `⚠️ ${lowStock.length} producto(s) con stock < ${THRESHOLD}`,
    body,
    meta: { products: lowStock.map((p) => p.id) },
  });

  return { checked: true, alerts: lowStock.length };
}

module.exports = { run, THRESHOLD };