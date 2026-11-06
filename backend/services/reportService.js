// backend/services/reportService.js
const { Producto, MovimientoStock, Pedido } = require('../models');
const { Op } = require('sequelize');
const notifier = require('./notificationService');

async function buildReport(since) {
  const [entradas, salidas, pedidos, productosBajos] = await Promise.all([
    MovimientoStock.sum('cantidad', { where: { tipo: 'entrada', fecha: { [Op.gte]: since } } }),
    MovimientoStock.sum('cantidad', { where: { tipo: 'salida',  fecha: { [Op.gte]: since } } }),
    Pedido.count({ where: { fecha: { [Op.gte]: since } } }),
    Producto.count({ where: { stock_actual: { [Op.lt]: 10 } } }),
  ]);

  return {
    since,
    entradas: entradas || 0,
    salidas: salidas || 0,
    neto: (entradas || 0) - (salidas || 0),
    pedidos,
    productosBajos,
  };
}

async function runDaily() {
  const data = await buildReport(new Date(Date.now() - 24 * 60 * 60 * 1000));
  await notifier.send({
    level: 'info',
    title: '📊 Reporte diario',
    body: `Entradas: ${data.entradas}\nSalidas: ${data.salidas}\nNeto: ${data.neto}\nPedidos: ${data.pedidos}\nStock bajo: ${data.productosBajos}`,
    meta: data,
  });
  return data;
}

async function runWeekly() {
  const data = await buildReport(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  await notifier.send({
    level: 'info',
    title: '📈 Reporte semanal',
    body: `Entradas: ${data.entradas}\nSalidas: ${data.salidas}\nNeto: ${data.neto}\nPedidos: ${data.pedidos}\nStock bajo: ${data.productosBajos}`,
    meta: data,
  });
  return data;
}

module.exports = { runDaily, runWeekly, buildReport };