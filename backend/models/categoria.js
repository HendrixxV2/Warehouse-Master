const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Categoria extends Model {
    static associate(models) {
      Categoria.hasMany(models.Producto, { foreignKey: 'id_categoria', as: 'productos' });
    }
  }

  Categoria.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true, validate: { notEmpty: true } },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
  }, { sequelize, modelName: 'Categoria', tableName: 'categorias', timestamps: false });

  return Categoria;
};
