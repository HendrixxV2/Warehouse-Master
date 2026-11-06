const { Op } = require('sequelize');
const { Producto, MovimientoStock, Pedido, sequelize } = require('../../models');
const { ask } = require('./deepseekClient');

const SYSTEM_PROMPT = 'Eres un asistente experto en WMS. Responde en español, conciso y accionable.';

async function getContext() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [totalProductos, stockTotal, stockBajo, pedidosPendientes, top5ProductosMovidos] = await Promise.all([
    Producto.count(),
    Producto.sum('stock_actual'),
    Producto.count({ where: { stock_actual: { [Op.lt]: 10 } } }),
    Pedido.count({ where: { estado: 'pendiente' } }),
    MovimientoStock.findAll({
      where: { tipo: 'salida', fecha: { [Op.gte]: since } },
      attributes: [
        'id_producto',
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'total_salidas'],
      ],
      include: [{ model: Producto, as: 'producto', attributes: ['nombre'] }],
      group: ['MovimientoStock.id_producto', 'producto.id', 'producto.nombre'],
      order: [[sequelize.literal('total_salidas'), 'DESC']],
      limit: 5,
    }),
  ]);

  return {
    totalProductos,
    stockTotal: Number(stockTotal || 0),
    stockBajo,
    pedidosPendientes,
    top5ProductosMovidos: top5ProductosMovidos.map((item) => ({
      id: item.id_producto,
      nombre: item.producto?.nombre || `Producto ${item.id_producto}`,
      total_salidas: Number(item.get('total_salidas') || 0),
    })),
  };
}

function fallbackAnswer(question, context) {
  if (/stock bajo|reponer/i.test(question)) {
    return `Hay ${context.stockBajo} productos con stock bajo. Revísalos en el dashboard.`;
  }
  if (/pendiente/i.test(question)) return `Hay ${context.pedidosPendientes} pedidos pendientes.`;
  if (/stock total|cuánto stock/i.test(question)) return `Stock total actual: ${context.stockTotal} unidades.`;

  const top = context.top5ProductosMovidos.length
    ? context.top5ProductosMovidos.map((p) => `${p.nombre} (${p.total_salidas})`).join(', ')
    : 'sin salidas registradas en los últimos 30 días';
  return `Productos: ${context.totalProductos}. Stock total: ${context.stockTotal} unidades. Stock bajo: ${context.stockBajo}. Pedidos pendientes: ${context.pedidosPendientes}. Productos más movidos: ${top}.`;
}

async function query(question) {
  const context = await getContext();
  const prompt = `Consulta del usuario: ${question}\n\nContexto actual del WMS:\n${JSON.stringify(context)}\n\nResponde usando únicamente este contexto.`;
  const result = await ask(prompt, { system: SYSTEM_PROMPT, temperature: 0.3, maxTokens: 600 });

  if (result.source === 'deepseek' && result.text) {
    return { source: 'deepseek', answer: result.text };
  }
  return { source: 'fallback', answer: fallbackAnswer(question, context) };
}

module.exports = { query, getContext, fallbackAnswer };
