const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.MovimientoStock, { foreignKey: 'id_usuario', as: 'movimientos' });
      Usuario.hasMany(models.Pedido, { foreignKey: 'id_usuario', as: 'pedidos' });
    }
  }

  Usuario.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false, validate: { notEmpty: true } },
    email: { type: DataTypes.STRING(254), allowNull: false, unique: true, validate: { isEmail: true } },
    rol: {
      type: DataTypes.ENUM('admin', 'supervisor', 'operador'),
      allowNull: false,
      defaultValue: 'operador',
    },
  }, { sequelize, modelName: 'Usuario', tableName: 'usuarios', timestamps: false });

  return Usuario;
};
