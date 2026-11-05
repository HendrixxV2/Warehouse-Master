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

    await queryInterface.createTable('clientes', {
      id: id(),
      nombre: { type: Sequelize.STRING(150), allowNull: false },
      email: { type: Sequelize.STRING(254), allowNull: true },
      telefono: { type: Sequelize.STRING(30), allowNull: true },
      direccion: { type: Sequelize.STRING(255), allowNull: true },
      tipo: { type: Sequelize.ENUM('retail', 'distribuidor', 'interno'), allowNull: false, defaultValue: 'retail' },
      activo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });

    await queryInterface.createTable('transportistas', {
      id: id(),
      nombre: { type: Sequelize.STRING(150), allowNull: false },
      empresa: { type: Sequelize.STRING(150), allowNull: true },
      telefono: { type: Sequelize.STRING(30), allowNull: true },
      documento: { type: Sequelize.STRING(50), allowNull: true },
      estado: { type: Sequelize.ENUM('activo', 'inactivo', 'en_revision'), allowNull: false, defaultValue: 'activo' },
    });

    await queryInterface.createTable('ordenes_compra', {
      id: id(),
      numero: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      fecha: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      id_proveedor: foreignKey('proveedores'),
      total: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      estado: { type: Sequelize.ENUM('pendiente', 'recibido', 'cancelado'), allowNull: false, defaultValue: 'pendiente' },
    });

    await queryInterface.createTable('recepciones', {
      id: id(),
      codigo: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      fecha: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      id_almacen: foreignKey('almacenes'),
      id_proveedor: foreignKey('proveedores'),
      estado: { type: Sequelize.ENUM('en_espera', 'recibido', 'revisado'), allowNull: false, defaultValue: 'en_espera' },
      observacion: { type: Sequelize.TEXT, allowNull: true },
    });

    await queryInterface.createTable('ubicaciones', {
      id: id(),
      codigo: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      id_almacen: foreignKey('almacenes'),
      nivel: { type: Sequelize.STRING(25), allowNull: true },
      pasillo: { type: Sequelize.STRING(25), allowNull: true },
      estanteria: { type: Sequelize.STRING(25), allowNull: true },
      capacidad: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    });

    await queryInterface.createTable('lotes', {
      id: id(),
      codigo: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      id_producto: foreignKey('productos'),
      fecha_vencimiento: { type: Sequelize.DATE, allowNull: true },
      cantidad: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      estado: { type: Sequelize.ENUM('activo', 'vencido', 'cancelado'), allowNull: false, defaultValue: 'activo' },
    });

    await queryInterface.createTable('auditorias', {
      id: id(),
      fecha: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      tipo: { type: Sequelize.STRING(50), allowNull: false },
      responsable: { type: Sequelize.STRING(150), allowNull: false },
      detalle: { type: Sequelize.TEXT, allowNull: true },
      id_almacen: foreignKey('almacenes'),
    });

    await queryInterface.createTable('incidencias', {
      id: id(),
      titulo: { type: Sequelize.STRING(150), allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      severidad: { type: Sequelize.ENUM('baja', 'media', 'alta', 'critica'), allowNull: false, defaultValue: 'media' },
      estado: { type: Sequelize.ENUM('abierta', 'en_proceso', 'cerrada'), allowNull: false, defaultValue: 'abierta' },
      id_usuario: foreignKey('usuarios'),
    });

    await queryInterface.createTable('turnos', {
      id: id(),
      nombre: { type: Sequelize.STRING(50), allowNull: false },
      fecha_inicio: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      fecha_fin: { type: Sequelize.DATE, allowNull: true },
      id_usuario: foreignKey('usuarios'),
      estado: { type: Sequelize.ENUM('activo', 'cerrado'), allowNull: false, defaultValue: 'activo' },
    });

    await queryInterface.createTable('paquetes', {
      id: id(),
      codigo: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      id_pedido: foreignKey('pedidos'),
      id_transportista: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'transportistas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      peso: { type: Sequelize.DECIMAL(8, 2), allowNull: true, defaultValue: 0 },
      estado: { type: Sequelize.ENUM('preparado', 'en_transito', 'entregado'), allowNull: false, defaultValue: 'preparado' },
      destino: { type: Sequelize.STRING(150), allowNull: true },
    });

    await queryInterface.createTable('etiquetas', {
      id: id(),
      codigo: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      tipo: { type: Sequelize.STRING(30), allowNull: false },
      id_producto: foreignKey('productos'),
      id_almacen: foreignKey('almacenes'),
    });

    await queryInterface.createTable('tarifas', {
      id: id(),
      concepto: { type: Sequelize.STRING(150), allowNull: false },
      monto: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      vigencia_inicio: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      vigencia_fin: { type: Sequelize.DATE, allowNull: true },
      activo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });

    await queryInterface.createTable('contratos', {
      id: id(),
      numero: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      id_proveedor: foreignKey('proveedores'),
      id_almacen: foreignKey('almacenes'),
      fecha_inicio: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      fecha_fin: { type: Sequelize.DATE, allowNull: true },
      estado: { type: Sequelize.ENUM('activo', 'expirado', 'cancelado'), allowNull: false, defaultValue: 'activo' },
    });

    await queryInterface.createTable('inventario_critico', {
      id: id(),
      id_producto: foreignKey('productos'),
      umbral_minimo: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      stock_actual: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      prioridad: { type: Sequelize.ENUM('baja', 'media', 'alta'), allowNull: false, defaultValue: 'media' },
      estado: { type: Sequelize.ENUM('pendiente', 'atendido', 'alerta'), allowNull: false, defaultValue: 'pendiente' },
    });

    await queryInterface.createTable('pedidos_internos', {
      id: id(),
      codigo: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      id_almacen_origen: foreignKey('almacenes'),
      id_almacen_destino: foreignKey('almacenes'),
      estado: { type: Sequelize.ENUM('pendiente', 'en_transito', 'completado'), allowNull: false, defaultValue: 'pendiente' },
      total: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    });

    await queryInterface.createTable('costos', {
      id: id(),
      concepto: { type: Sequelize.STRING(150), allowNull: false },
      monto: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      id_almacen: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      id_producto: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      periodo: { type: Sequelize.STRING(20), allowNull: false },
    });

    await queryInterface.createTable('permisos', {
      id: id(),
      nombre: { type: Sequelize.STRING(100), allowNull: false },
      modulo: { type: Sequelize.STRING(100), allowNull: false },
      rol: { type: Sequelize.ENUM('admin', 'supervisor', 'operador'), allowNull: false, defaultValue: 'operador' },
      activo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('permisos');
    await queryInterface.dropTable('costos');
    await queryInterface.dropTable('pedidos_internos');
    await queryInterface.dropTable('inventario_critico');
    await queryInterface.dropTable('contratos');
    await queryInterface.dropTable('tarifas');
    await queryInterface.dropTable('etiquetas');
    await queryInterface.dropTable('paquetes');
    await queryInterface.dropTable('turnos');
    await queryInterface.dropTable('incidencias');
    await queryInterface.dropTable('auditorias');
    await queryInterface.dropTable('lotes');
    await queryInterface.dropTable('ubicaciones');
    await queryInterface.dropTable('recepciones');
    await queryInterface.dropTable('ordenes_compra');
    await queryInterface.dropTable('transportistas');
    await queryInterface.dropTable('clientes');
  },
};
