const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Proveedor extends Model {
    static associate(models) {
      Proveedor.hasMany(models.Producto, { foreignKey: 'id_proveedor', as: 'productos' });
    }
  }

  Proveedor.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false, validate: { notEmpty: true } },
    email: { type: DataTypes.STRING(254), allowNull: true, unique: true, validate: { isEmail: true } },
    telefono: { type: DataTypes.STRING(30), allowNull: true },
    direccion: { type: DataTypes.STRING(255), allowNull: true },
  }, { sequelize, modelName: 'Proveedor', tableName: 'proveedores', timestamps: false });

  return Proveedor;
};
