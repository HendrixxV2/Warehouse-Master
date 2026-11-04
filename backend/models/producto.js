// backend/models/producto.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Producto extends Model {
    static associate(models) {
      Producto.belongsTo(models.Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });
      Producto.belongsTo(models.Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
      Producto.belongsTo(models.Almacen,  { foreignKey: 'id_almacen',   as: 'almacen' });
      Producto.hasMany(models.MovimientoStock, { foreignKey: 'id_producto', as: 'movimientos' });
      Producto.hasMany(models.DetallePedido,   { foreignKey: 'id_producto', as: 'detalles' });
    }
  }

  Producto.init(
    {
      id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre:       { type: DataTypes.STRING(150), allowNull: false },
      precio:       { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      stock_actual: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      id_proveedor: { type: DataTypes.INTEGER, allowNull: false },
      id_categoria: { type: DataTypes.INTEGER, allowNull: false },
      id_almacen:   { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: 'Producto', tableName: 'productos', timestamps: false }
  );

  return Producto;
};