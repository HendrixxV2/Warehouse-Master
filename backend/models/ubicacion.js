const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Ubicacion extends Model {
    static associate(models) {
      Ubicacion.belongsTo(models.Almacen, { foreignKey: 'id_almacen', as: 'almacen' });
    }
  }

  Ubicacion.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    codigo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    id_almacen: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    nivel: { type: DataTypes.STRING(25), allowNull: true },
    pasillo: { type: DataTypes.STRING(25), allowNull: true },
    estanteria: { type: DataTypes.STRING(25), allowNull: true },
    capacidad: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  }, { sequelize, modelName: 'Ubicacion', tableName: 'ubicaciones', timestamps: false });

  return Ubicacion;
};
