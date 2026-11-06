const notifier = require('./notificationService');
const stockAlert = require('./stockAlertService');
const anomaly = require('./anomalyDetectionService');
const report = require('./reportService');
const cleanup = require('./dataCleanupService');
const aiAssistant = require('./ai/aiAssistantService');
const demandForecast = require('./ai/demandForecastService');
const emailService = require('./emailService');
const scheduler = require('./scheduler');

module.exports = { notifier, stockAlert, anomaly, report, cleanup, ai: aiAssistant, aiAssistant, demandForecast, emailService, scheduler };
