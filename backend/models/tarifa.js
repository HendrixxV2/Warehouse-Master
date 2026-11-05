const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Tarifa extends Model {}

  Tarifa.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    concepto: { type: DataTypes.STRING(150), allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    vigencia_inicio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    vigencia_fin: { type: DataTypes.DATE, allowNull: true },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, { sequelize, modelName: 'Tarifa', tableName: 'tarifas', timestamps: false });

  return Tarifa;
};
