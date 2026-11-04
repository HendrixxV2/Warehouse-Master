const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Producto extends Model {
    static associate(models) {
      Producto.belongsTo(models.Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });
      Producto.belongsTo(models.Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
      Producto.belongsTo(models.Almacen, { foreignKey: 'id_almacen', as: 'almacen' });
      Producto.hasMany(models.MovimientoStock, { foreignKey: 'id_producto', as: 'movimientos' });
      Producto.hasMany(models.DetallePedido, { foreignKey: 'id_producto', as: 'detalles' });
    }
  }

  Producto.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      nombre: { type: DataTypes.STRING(150), allowNull: false, validate: { notEmpty: true } },
      precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
      stock_actual: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      id_proveedor: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      id_categoria: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      id_almacen: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    { sequelize, modelName: 'Producto', tableName: 'productos', timestamps: false }
  );

  return Producto;
};