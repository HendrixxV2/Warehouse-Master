const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class MovimientoStock extends Model {
    static associate(models) {
      MovimientoStock.belongsTo(models.Producto, { foreignKey: 'id_producto', as: 'producto' });
      MovimientoStock.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
    }
  }

  MovimientoStock.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    tipo: { type: DataTypes.ENUM('entrada', 'salida'), allowNull: false },
    cantidad: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { min: 1 } },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    id_usuario: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    id_producto: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  }, { sequelize, modelName: 'MovimientoStock', tableName: 'movimientos_stock', timestamps: false });

  return MovimientoStock;
};
