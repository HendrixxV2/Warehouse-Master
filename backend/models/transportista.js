const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Transportista extends Model {
    static associate(models) {
      Transportista.hasMany(models.Paquete, { foreignKey: 'id_transportista', as: 'paquetes' });
    }
  }

  Transportista.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    empresa: { type: DataTypes.STRING(150), allowNull: true },
    telefono: { type: DataTypes.STRING(30), allowNull: true },
    documento: { type: DataTypes.STRING(50), allowNull: true },
    estado: { type: DataTypes.ENUM('activo', 'inactivo', 'en_revision'), allowNull: false, defaultValue: 'activo' },
  }, { sequelize, modelName: 'Transportista', tableName: 'transportistas', timestamps: false });

  return Transportista;
};
