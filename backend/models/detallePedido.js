const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class DetallePedido extends Model {
    static associate(models) {
      DetallePedido.belongsTo(models.Pedido, { foreignKey: 'id_pedido', as: 'pedido' });
      DetallePedido.belongsTo(models.Producto, { foreignKey: 'id_producto', as: 'producto' });
    }
  }

  DetallePedido.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    cantidad: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { min: 1 } },
    precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
    id_pedido: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    id_producto: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  }, { sequelize, modelName: 'DetallePedido', tableName: 'detalles_pedido', timestamps: false });

  return DetallePedido;
};
