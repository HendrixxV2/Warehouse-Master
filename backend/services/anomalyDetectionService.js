// backend/services/anomalyDetectionService.js
const { MovimientoStock, Usuario, sequelize } = require('../models');
const { Op } = require('sequelize');
const notifier = require('./notificationService');

const HOUR_AGO = () => new Date(Date.now() - 60 * 60 * 1000);

async function run() {
  const alerts = [];
  const since = HOUR_AGO();

  // Regla 1: salida inusualmente grande (posible robo o error)
  const bigExits = await MovimientoStock.findAll({
    where: { tipo: 'salida', cantidad: { [Op.gte]: 100 }, fecha: { [Op.gte]: since } },
    include: [{ model: Usuario, as: 'usuario', attributes: ['nombre'] }],
  });
  bigExits.forEach((m) =>
    alerts.push({
      severity: 'high',
      type: 'salida_grande',
      msg: `Salida de ${m.cantidad} uds (producto ${m.id_producto}) por ${m.usuario?.nombre || 'desconocido'}`,
    })
  );

  // Regla 2: usuario con actividad anómala (>=20 movimientos en 1h)
  const topUsers = await MovimientoStock.findAll({
    where: { fecha: { [Op.gte]: since } },
    attributes: [
      'id_usuario',
      [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
    ],
    group: ['id_usuario'],
    having: sequelize.literal('COUNT(id) >= 20'),
    raw: true,
  });
  topUsers.forEach((u) =>
    alerts.push({
      severity: 'medium',
      type: 'usuario_activo',
      msg: `Usuario ${u.id_usuario} registró ${u.total} movimientos en la última hora`,
    })
  );

  if (alerts.length) {
    await notifier.send({
      level: 'warning',
      title: `🔍 ${alerts.length} anomalía(s) detectada(s)`,
      body: alerts.map((a) => `[${a.severity}] ${a.msg}`).join('\n'),
      meta: { alerts },
    });
  }

  return { anomalies: alerts.length, details: alerts };
}

module.exports = { run };