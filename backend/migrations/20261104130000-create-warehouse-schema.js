'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const id = () => ({
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });
    const foreignKey = (table, field = 'id') => ({
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: table, key: field },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.createTable('categorias', {
      id: id(),
      nombre: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
    });

    await queryInterface.createTable('proveedores', {
      id: id(),
      nombre: { type: Sequelize.STRING(150), allowNull: false },
      email: { type: Sequelize.STRING(254), allowNull: true, unique: true },
      telefono: { type: Sequelize.STRING(30), allowNull: true },
      direccion: { type: Sequelize.STRING(255), allowNull: true },
    });

    await queryInterface.createTable('almacenes', {
      id: id(),
      nombre: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      ubicacion: { type: Sequelize.STRING(255), allowNull: true },
      capacidad: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
    });

    await queryInterface.createTable('usuarios', {
      id: id(),
      nombre: { type: Sequelize.STRING(150), allowNull: false },
      email: { type: Sequelize.STRING(254), allowNull: false, unique: true },
      rol: {
        type: Sequelize.ENUM('admin', 'supervisor', 'operador'),
        allowNull: false,
        defaultValue: 'operador',
      },
    });

    await queryInterface.createTable('productos', {
      id: id(),
      nombre: { type: Sequelize.STRING(150), allowNull: false },
      precio: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      stock_actual: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      id_proveedor: foreignKey('proveedores'),
      id_categoria: foreignKey('categorias'),
      id_almacen: foreignKey('almacenes'),
    });

    await queryInterface.createTable('movimientos_stock', {
      id: id(),
      tipo: { type: Sequelize.ENUM('entrada', 'salida'), allowNull: false },
      cantidad: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      fecha: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      id_usuario: foreignKey('usuarios'),
      id_producto: foreignKey('productos'),
    });

    await queryInterface.createTable('pedidos', {
      id: id(),
      fecha: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      estado: {
        type: Sequelize.ENUM('pendiente', 'procesando', 'completado', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendiente',
      },
      total: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      id_usuario: foreignKey('usuarios'),
    });

    await queryInterface.createTable('detalles_pedido', {
      id: id(),
      cantidad: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      precio_unitario: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      id_pedido: {
        ...foreignKey('pedidos'),
        onDelete: 'CASCADE',
      },
      id_producto: foreignKey('productos'),
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('detalles_pedido');
    await queryInterface.dropTable('pedidos');
    await queryInterface.dropTable('movimientos_stock');
    await queryInterface.dropTable('productos');
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('almacenes');
    await queryInterface.dropTable('proveedores');
    await queryInterface.dropTable('categorias');
  },
};
