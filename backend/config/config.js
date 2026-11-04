const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const configs = require('./config.json');
const environment = process.env.NODE_ENV || 'development';
const currentConfig = configs[environment];

if (!currentConfig) {
  throw new Error(`No hay configuración de base de datos para NODE_ENV=${environment}`);
}

const port = process.env.DB_PORT === undefined
  ? currentConfig.port
  : Number(process.env.DB_PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('DB_PORT debe ser un puerto válido entre 1 y 65535.');
}

module.exports = {
  ...configs,
  [environment]: {
    ...currentConfig,
    host: process.env.DB_HOST || currentConfig.host,
    port,
    database: process.env.DB_NAME || currentConfig.database,
    username: process.env.DB_USER || currentConfig.username,
    password: process.env.DB_PASSWORD === undefined
      ? currentConfig.password
      : process.env.DB_PASSWORD,
    logging: process.env.DB_LOGGING === undefined
      ? currentConfig.logging
      : process.env.DB_LOGGING.toLowerCase() === 'true',
  },
};
