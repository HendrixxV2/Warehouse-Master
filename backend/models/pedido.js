const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Pedido extends Model {
    static associate(models) {
      Pedido.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
      Pedido.belongsTo(models.Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
      Pedido.hasMany(models.DetallePedido, { foreignKey: 'id_pedido', as: 'detalles' });
    }
  }

  Pedido.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    estado: {
      type: DataTypes.ENUM('pendiente', 'procesando', 'completado', 'cancelado'),
      allowNull: false,
      defaultValue: 'pendiente',
    },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    id_usuario: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    // Es opcional para mantener la compatibilidad con los pedidos ya creados.
    id_cliente: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  }, { sequelize, modelName: 'Pedido', tableName: 'pedidos', timestamps: false });

  return Pedido;
};
