const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Almacen extends Model {
    static associate(models) {
      Almacen.hasMany(models.Producto, { foreignKey: 'id_almacen', as: 'productos' });
    }
  }

  Almacen.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { notEmpty: true } },
    ubicacion: { type: DataTypes.STRING(255), allowNull: true },
    capacidad: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  }, { sequelize, modelName: 'Almacen', tableName: 'almacenes', timestamps: false });

  return Almacen;
};
