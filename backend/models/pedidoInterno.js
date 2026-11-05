const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PedidoInterno extends Model {
    static associate(models) {
      PedidoInterno.belongsTo(models.Almacen, { foreignKey: 'id_almacen_origen', as: 'almacen_origen' });
      PedidoInterno.belongsTo(models.Almacen, { foreignKey: 'id_almacen_destino', as: 'almacen_destino' });
    }
  }

  PedidoInterno.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    codigo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    id_almacen_origen: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    id_almacen_destino: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    estado: { type: DataTypes.ENUM('pendiente', 'en_transito', 'completado'), allowNull: false, defaultValue: 'pendiente' },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  }, { sequelize, modelName: 'PedidoInterno', tableName: 'pedidos_internos', timestamps: false });

  return PedidoInterno;
};
