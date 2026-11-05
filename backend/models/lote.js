const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Lote extends Model {
    static associate(models) {
      Lote.belongsTo(models.Producto, { foreignKey: 'id_producto', as: 'producto' });
    }
  }

  Lote.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    codigo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    id_producto: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    fecha_vencimiento: { type: DataTypes.DATE, allowNull: true },
    cantidad: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    estado: { type: DataTypes.ENUM('activo', 'vencido', 'cancelado'), allowNull: false, defaultValue: 'activo' },
  }, { sequelize, modelName: 'Lote', tableName: 'lotes', timestamps: false });

  return Lote;
};
