const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Recepcion extends Model {
    static associate(models) {
      Recepcion.belongsTo(models.Almacen, { foreignKey: 'id_almacen', as: 'almacen' });
      Recepcion.belongsTo(models.Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });
    }
  }

  Recepcion.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    codigo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    id_almacen: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    id_proveedor: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    estado: { type: DataTypes.ENUM('en_espera', 'recibido', 'revisado'), allowNull: false, defaultValue: 'en_espera' },
    observacion: { type: DataTypes.TEXT, allowNull: true },
  }, { sequelize, modelName: 'Recepcion', tableName: 'recepciones', timestamps: false });

  return Recepcion;
};
