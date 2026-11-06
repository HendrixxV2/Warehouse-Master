// backend/services/notificationService.js
const recent = [];
const MAX_BUFFER = 100;

async function send({ level = 'info', title, body, meta = {} }) {
  const entry = { level, title, body, meta, at: new Date().toISOString() };
  recent.push(entry);
  if (recent.length > MAX_BUFFER) recent.shift();

  console.log(`[${level.toUpperCase()}] ${title}\n${body}`);

  // Webhook opcional (Slack/Discord/Teams)
  if (process.env.ALERT_WEBHOOK_URL) {
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

  return entry;
}

function list(limit = 20) {
  return recent.slice(-limit).reverse();
}

module.exports = { send, list };