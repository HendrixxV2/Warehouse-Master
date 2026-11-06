const cron = require('node-cron');
const stockAlert = require('./stockAlertService');
const anomaly = require('./anomalyDetectionService');
const report = require('./reportService');
const cleanup = require('./dataCleanupService');

let started = false;
const runSafely = (task) => () => task().catch((error) => console.error('[scheduler]', error.message));

function startScheduler() {
  if (started) return;
  started = true;
  cron.schedule('*/30 * * * *', runSafely(stockAlert.run));
  cron.schedule('0 * * * *', runSafely(anomaly.run));
  cron.schedule('0 8 * * *', runSafely(report.runDaily));
  cron.schedule('0 9 * * 1', runSafely(report.runWeekly));
  cron.schedule('0 3 * * *', runSafely(cleanup.run));
  cron.schedule('0 7 * * 1', () => {
    const { forecast } = require('./ai/demandForecastService');
    forecast().catch(console.error);
  });
}

module.exports = { startScheduler };
