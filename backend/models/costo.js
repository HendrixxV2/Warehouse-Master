const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Costo extends Model {
    static associate(models) {
      Costo.belongsTo(models.Almacen, { foreignKey: 'id_almacen', as: 'almacen' });
      Costo.belongsTo(models.Producto, { foreignKey: 'id_producto', as: 'producto' });
    }
  }

  Costo.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    concepto: { type: DataTypes.STRING(150), allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    id_almacen: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    id_producto: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    periodo: { type: DataTypes.STRING(20), allowNull: false },
  }, { sequelize, modelName: 'Costo', tableName: 'costos', timestamps: false });

  return Costo;
};
