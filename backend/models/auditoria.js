const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Auditoria extends Model {
    static associate(models) {
      Auditoria.belongsTo(models.Almacen, { foreignKey: 'id_almacen', as: 'almacen' });
    }
  }

  Auditoria.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    tipo: { type: DataTypes.STRING(50), allowNull: false },
    responsable: { type: DataTypes.STRING(150), allowNull: false },
    detalle: { type: DataTypes.TEXT, allowNull: true },
    id_almacen: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  }, { sequelize, modelName: 'Auditoria', tableName: 'auditorias', timestamps: false });

  return Auditoria;
};
