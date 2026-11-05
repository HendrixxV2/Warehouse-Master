const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class OrdenCompra extends Model {
    static associate(models) {
      OrdenCompra.belongsTo(models.Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });
    }
  }

  OrdenCompra.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    numero: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    id_proveedor: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    estado: { type: DataTypes.ENUM('pendiente', 'recibido', 'cancelado'), allowNull: false, defaultValue: 'pendiente' },
  }, { sequelize, modelName: 'OrdenCompra', tableName: 'ordenes_compra', timestamps: false });

  return OrdenCompra;
};
