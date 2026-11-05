const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cliente extends Model {
    static associate(models) {
      Cliente.hasMany(models.Pedido, { foreignKey: 'id_cliente', as: 'pedidos' });
    }
  }

  Cliente.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(254), allowNull: true },
    telefono: { type: DataTypes.STRING(30), allowNull: true },
    direccion: { type: DataTypes.STRING(255), allowNull: true },
    tipo: { type: DataTypes.ENUM('retail', 'distribuidor', 'interno'), allowNull: false, defaultValue: 'retail' },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, { sequelize, modelName: 'Cliente', tableName: 'clientes', timestamps: false });

  return Cliente;
};
