const { Op } = require('sequelize');
const { MovimientoStock, Producto, sequelize } = require('../../models');
const { ask } = require('./deepseekClient');

function createFallback(row) {
  const promedio_diario = Number(row.total_salidas) / 30;
  const demanda_estimada_7d = Math.round(promedio_diario * 7);
  const riesgo = Number(row.stock_actual) < demanda_estimada_7d ? 'alto' : 'bajo';
  return {
    id: Number(row.id),
    nombre: row.nombre,
    stock_actual: Number(row.stock_actual),
    demanda_estimada_7d,
    riesgo,
    recomendacion: riesgo === 'alto' ? 'Reponer inmediatamente' : 'Stock suficiente',
  };
}

function orderByRisk(predicciones) {
  return [...predicciones].sort((a, b) => {
    if (a.riesgo !== b.riesgo) return a.riesgo === 'alto' ? -1 : 1;
    return b.demanda_estimada_7d - a.demanda_estimada_7d;
  });
}

async function forecast() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const rows = await MovimientoStock.findAll({
    where: { tipo: 'salida', fecha: { [Op.gte]: since } },
    attributes: [
      'id_producto',
      [sequelize.fn('SUM', sequelize.col('cantidad')), 'total_salidas'],
      [sequelize.fn('COUNT', sequelize.col('MovimientoStock.id')), 'veces'],
    ],
    include: [{ model: Producto, as: 'producto', attributes: ['id', 'nombre', 'stock_actual'] }],
    group: ['MovimientoStock.id_producto', 'producto.id', 'producto.nombre', 'producto.stock_actual'],
    order: [[sequelize.literal('total_salidas'), 'DESC']],
    limit: 20,
  });

  if (!rows.length) return { source: 'empty', predicciones: [] };

  const fallback = rows.map((row) => createFallback({
    id: row.id_producto,
    nombre: row.producto?.nombre || `Producto ${row.id_producto}`,
    stock_actual: row.producto?.stock_actual || 0,
    total_salidas: row.get('total_salidas'),
  }));
  const candidates = orderByRisk(fallback).slice(0, 10);
  const result = await ask(
    `Genera exclusivamente JSON válido con la forma {"predicciones":[{"id":number,"nombre":string,"stock_actual":number,"demanda_estimada_7d":number,"riesgo":"alto|bajo","recomendacion":string}]}. Analiza estos productos y devuelve como máximo los 10, manteniendo los campos: ${JSON.stringify(candidates)}`,
    { system: 'Eres un analista de demanda de un WMS. No inventes productos ni datos.', jsonMode: true, temperature: 0.3, maxTokens: 1200 }
  );

  if (result.source === 'deepseek' && result.text) {
    try {
      const parsed = JSON.parse(result.text);
      if (Array.isArray(parsed.predicciones) && parsed.predicciones.length) {
        const allowed = new Map(candidates.map((item) => [item.id, item]));
        const predicciones = parsed.predicciones.slice(0, 10).map((item) => {
          const original = allowed.get(Number(item.id));
          if (!original || !['alto', 'bajo'].includes(item.riesgo)) return null;
          return {
            id: original.id,
            nombre: original.nombre,
            stock_actual: original.stock_actual,
            demanda_estimada_7d: Number.isFinite(Number(item.demanda_estimada_7d)) ? Number(item.demanda_estimada_7d) : original.demanda_estimada_7d,
            riesgo: item.riesgo,
            recomendacion: typeof item.recomendacion === 'string' && item.recomendacion.trim() ? item.recomendacion.trim() : original.recomendacion,
          };
        }).filter(Boolean);
        if (predicciones.length) return { source: 'deepseek', predicciones: orderByRisk(predicciones) };
      }
    } catch (_) {
      // Un JSON inválido se atiende con la predicción determinista.
    }
  }

  return { source: 'fallback', predicciones: fallback };
}

module.exports = { forecast, createFallback, orderByRisk };
