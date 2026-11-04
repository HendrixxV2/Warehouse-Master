const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

if (!config) {
  throw new Error(`No hay configuración de base de datos para NODE_ENV=${process.env.NODE_ENV}`);
}

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  logging: config.logging ? console.log : false,
});

const models = {};
const modelFiles = fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.js') && file !== 'index.js');

for (const file of modelFiles) {
  const defineModel = require(path.join(__dirname, file));
  const model = defineModel(sequelize);
  models[model.name] = model;
}

for (const model of Object.values(models)) {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
}

module.exports = { ...models, sequelize, Sequelize };
