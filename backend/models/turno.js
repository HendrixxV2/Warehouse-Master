const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Turno extends Model {
    static associate(models) {
      Turno.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
    }
  }

  Turno.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    fecha_inicio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    fecha_fin: { type: DataTypes.DATE, allowNull: true },
    id_usuario: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    estado: { type: DataTypes.ENUM('activo', 'cerrado'), allowNull: false, defaultValue: 'activo' },
  }, { sequelize, modelName: 'Turno', tableName: 'turnos', timestamps: false });

  return Turno;
};
