const express = require('express');
const { autenticar } = require('../middleware/auth');
const { query } = require('../services/ai/aiAssistantService');
const { forecast } = require('../services/ai/demandForecastService');
const { sendEmail } = require('../services/emailService');

const router = express.Router();
router.use(autenticar);

router.post('/ai/query', async (req, res) => {
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  if (!question) return res.status(400).json({ error: 'question es requerido' });
  try {
    return res.status(200).json(await query(question));
  } catch (_) {
    return res.status(500).json({ error: 'error interno del servidor' });
  }
});

router.get('/forecast/demand', async (_req, res) => {
  try {
    return res.status(200).json(await forecast());
  } catch (_) {
    return res.status(500).json({ error: 'error interno del servidor' });
  }
});

router.post('/notifications/test-email', async (req, res) => {
  const to = typeof req.body?.to === 'string' ? req.body.to.trim() : '';
  if (!to) return res.status(400).json({ error: 'to es requerido' });
  const result = await sendEmail({
    to,
    subject: 'Prueba de alertas Warehouse Master',
    text: 'Este es un correo de prueba del sistema de alertas.',
    html: '<p>Este es un correo de prueba del sistema de alertas.</p>',
  });
  return res.status(200).json(result);
});

module.exports = router;
