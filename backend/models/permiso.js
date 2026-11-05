const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Permiso extends Model {}

  Permiso.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    modulo: { type: DataTypes.STRING(100), allowNull: false },
    rol: { type: DataTypes.ENUM('admin', 'supervisor', 'operador'), allowNull: false, defaultValue: 'operador' },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, { sequelize, modelName: 'Permiso', tableName: 'permisos', timestamps: false });

  return Permiso;
};
