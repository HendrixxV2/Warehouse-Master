const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Contrato extends Model {
    static associate(models) {
      Contrato.belongsTo(models.Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });
      Contrato.belongsTo(models.Almacen, { foreignKey: 'id_almacen', as: 'almacen' });
    }
  }

  Contrato.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    numero: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    id_proveedor: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    id_almacen: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    fecha_inicio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    fecha_fin: { type: DataTypes.DATE, allowNull: true },
    estado: { type: DataTypes.ENUM('activo', 'expirado', 'cancelado'), allowNull: false, defaultValue: 'activo' },
  }, { sequelize, modelName: 'Contrato', tableName: 'contratos', timestamps: false });

  return Contrato;
};
