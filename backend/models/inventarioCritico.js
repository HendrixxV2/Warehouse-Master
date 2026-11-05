const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class InventarioCritico extends Model {
    static associate(models) {
      InventarioCritico.belongsTo(models.Producto, { foreignKey: 'id_producto', as: 'producto' });
    }
  }

  InventarioCritico.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    id_producto: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    umbral_minimo: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    stock_actual: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    prioridad: { type: DataTypes.ENUM('baja', 'media', 'alta'), allowNull: false, defaultValue: 'media' },
    estado: { type: DataTypes.ENUM('pendiente', 'atendido', 'alerta'), allowNull: false, defaultValue: 'pendiente' },
  }, { sequelize, modelName: 'InventarioCritico', tableName: 'inventario_critico', timestamps: false });

  return InventarioCritico;
};
