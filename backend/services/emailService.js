const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, html, text }) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('SMTP no configurado');
    return { sent: false };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({ from: process.env.SMTP_FROM || SMTP_USER, to, subject, text, html });
    return { sent: true };
  } catch (error) {
    return { sent: false, error: error.message };
  }
}

module.exports = { sendEmail };
