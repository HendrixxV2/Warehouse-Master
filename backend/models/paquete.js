const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Paquete extends Model {
    static associate(models) {
      Paquete.belongsTo(models.Pedido, { foreignKey: 'id_pedido', as: 'pedido' });
      Paquete.belongsTo(models.Transportista, { foreignKey: 'id_transportista', as: 'transportista' });
    }
  }

  Paquete.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    codigo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    id_pedido: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    id_transportista: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    peso: { type: DataTypes.DECIMAL(8, 2), allowNull: true, defaultValue: 0 },
    estado: { type: DataTypes.ENUM('preparado', 'en_transito', 'entregado'), allowNull: false, defaultValue: 'preparado' },
    destino: { type: DataTypes.STRING(150), allowNull: true },
  }, { sequelize, modelName: 'Paquete', tableName: 'paquetes', timestamps: false });

  return Paquete;
};
