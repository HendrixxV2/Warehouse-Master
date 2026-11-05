const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Etiqueta extends Model {
    static associate(models) {
      Etiqueta.belongsTo(models.Producto, { foreignKey: 'id_producto', as: 'producto' });
      Etiqueta.belongsTo(models.Almacen, { foreignKey: 'id_almacen', as: 'almacen' });
    }
  }

  Etiqueta.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    codigo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    tipo: { type: DataTypes.STRING(30), allowNull: false },
    id_producto: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    id_almacen: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  }, { sequelize, modelName: 'Etiqueta', tableName: 'etiquetas', timestamps: false });

  return Etiqueta;
};
