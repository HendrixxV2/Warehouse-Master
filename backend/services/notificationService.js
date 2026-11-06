// backend/services/notificationService.js
const recent = [];
const MAX_BUFFER = 100;

const emailService = require('./emailService');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function emailHtml(title, body, meta) {
  const rows = Object.entries(meta || {}).map(([key, value]) => (
    `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(typeof value === 'object' ? JSON.stringify(value) : value)}</td></tr>`
  )).join('');
  return `<h2>${escapeHtml(title)}</h2><p>${escapeHtml(body).replace(/\n/g, '<br>')}</p>${rows ? `<table border="1" cellpadding="6"><tbody>${rows}</tbody></table>` : ''}`;
}

async function send({ level = 'info', title, body, meta = {}, channels = ['console', 'webhook', 'email'] }) {
  const entry = { level, title, body, meta, at: new Date().toISOString() };
  recent.push(entry);
  if (recent.length > MAX_BUFFER) recent.shift();

  if (channels.includes('console')) {
    console.log(`[${level.toUpperCase()}] ${title}\n${body}`);
  }

  // Webhook opcional (Slack/Discord/Teams)
  if (channels.includes('webhook') && process.env.ALERT_WEBHOOK_URL) {
    try {
      await fetch(process.env.ALERT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `${title}\n${body}` }),
      });
    } catch (e) {
      console.error('[notifier] webhook falló:', e.message);
    }
  }

  if (channels.includes('email') && ['warning', 'danger', 'critical'].includes(level) && process.env.ALERT_EMAIL_TO) {
    try {
      await emailService.sendEmail({
        to: process.env.ALERT_EMAIL_TO,
        subject: title,
        text: body,
        html: emailHtml(title, body, meta),
      });
    } catch (e) {
      console.error('[notifier] email falló:', e.message);
    }
  }

  return entry;
}

function list(limit = 20) {
  return recent.slice(-limit).reverse();
}

module.exports = { send, list };
