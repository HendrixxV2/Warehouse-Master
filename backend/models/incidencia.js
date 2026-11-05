const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Incidencia extends Model {
    static associate(models) {
      Incidencia.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
    }
  }

  Incidencia.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    titulo: { type: DataTypes.STRING(150), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    severidad: { type: DataTypes.ENUM('baja', 'media', 'alta', 'critica'), allowNull: false, defaultValue: 'media' },
    estado: { type: DataTypes.ENUM('abierta', 'en_proceso', 'cerrada'), allowNull: false, defaultValue: 'abierta' },
    id_usuario: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  }, { sequelize, modelName: 'Incidencia', tableName: 'incidencias', timestamps: false });

  return Incidencia;
};
