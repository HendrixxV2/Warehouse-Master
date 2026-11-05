'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('clientes', [
      { id: 1, nombre: 'Retail Norte', email: 'retail@norte.com', telefono: '555-1101', direccion: 'Av. Norte 100', tipo: 'retail', activo: true },
    ]);

    await queryInterface.bulkInsert('transportistas', [
      { id: 1, nombre: 'Logística Central', empresa: 'L-Central', telefono: '555-7201', documento: 'DOC-1001', estado: 'activo' },
    ]);

    await queryInterface.bulkInsert('ordenes_compra', [
      { id: 1, numero: 'OC-1001', fecha: new Date(), id_proveedor: 1, total: 1250.00, estado: 'pendiente' },
    ]);

    await queryInterface.bulkInsert('recepciones', [
      { id: 1, codigo: 'RC-1001', fecha: new Date(), id_almacen: 1, id_proveedor: 1, estado: 'en_espera', observacion: 'Recepción programada.' },
    ]);

    await queryInterface.bulkInsert('ubicaciones', [
      { id: 1, codigo: 'A-01-01', id_almacen: 1, nivel: '1', pasillo: 'A', estanteria: '01', capacidad: 200 },
    ]);

    await queryInterface.bulkInsert('lotes', [
      { id: 1, codigo: 'LOT-1001', id_producto: 1, fecha_vencimiento: new Date(Date.now() + 86400000 * 90), cantidad: 150, estado: 'activo' },
    ]);

    await queryInterface.bulkInsert('auditorias', [
      { id: 1, fecha: new Date(), tipo: 'inventario', responsable: 'Supervisor', detalle: 'Auditoría de stock.', id_almacen: 1 },
    ]);

    await queryInterface.bulkInsert('incidencias', [
      { id: 1, titulo: 'Fallo de escáner', descripcion: 'Escáner de salida no responde.', severidad: 'media', estado: 'abierta', id_usuario: 1 },
    ]);

    await queryInterface.bulkInsert('turnos', [
      { id: 1, nombre: 'Mañana', fecha_inicio: new Date(), fecha_fin: null, id_usuario: 1, estado: 'activo' },
    ]);

    await queryInterface.bulkInsert('paquetes', [
      { id: 1, codigo: 'PK-1001', id_pedido: 1, id_transportista: 1, peso: 15.5, estado: 'preparado', destino: 'CD Central' },
    ]);

    await queryInterface.bulkInsert('etiquetas', [
      { id: 1, codigo: 'ET-1001', tipo: 'inventario', id_producto: 1, id_almacen: 1 },
    ]);

    await queryInterface.bulkInsert('tarifas', [
      { id: 1, concepto: 'Almacenaje mensual', monto: 120.00, vigencia_inicio: new Date(), vigencia_fin: null, activo: true },
    ]);

    await queryInterface.bulkInsert('contratos', [
      { id: 1, numero: 'CTR-1001', id_proveedor: 1, id_almacen: 1, fecha_inicio: new Date(), fecha_fin: null, estado: 'activo' },
    ]);

    await queryInterface.bulkInsert('inventario_critico', [
      { id: 1, id_producto: 1, umbral_minimo: 25, stock_actual: 18, prioridad: 'alta', estado: 'alerta' },
    ]);

    await queryInterface.bulkInsert('pedidos_internos', [
      { id: 1, codigo: 'PI-1001', id_almacen_origen: 1, id_almacen_destino: 1, estado: 'pendiente', total: 420.50 },
    ]);

    await queryInterface.bulkInsert('costos', [
      { id: 1, concepto: 'Flete local', monto: 85.00, id_almacen: 1, id_producto: 1, periodo: '2026-11' },
    ]);

    await queryInterface.bulkInsert('permisos', [
      { id: 1, nombre: 'Gestión de inventario', modulo: 'inventario', rol: 'admin', activo: true },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('permisos', null, {});
    await queryInterface.bulkDelete('costos', null, {});
    await queryInterface.bulkDelete('pedidos_internos', null, {});
    await queryInterface.bulkDelete('inventario_critico', null, {});
    await queryInterface.bulkDelete('contratos', null, {});
    await queryInterface.bulkDelete('tarifas', null, {});
    await queryInterface.bulkDelete('etiquetas', null, {});
    await queryInterface.bulkDelete('paquetes', null, {});
    await queryInterface.bulkDelete('turnos', null, {});
    await queryInterface.bulkDelete('incidencias', null, {});
    await queryInterface.bulkDelete('auditorias', null, {});
    await queryInterface.bulkDelete('lotes', null, {});
    await queryInterface.bulkDelete('ubicaciones', null, {});
    await queryInterface.bulkDelete('recepciones', null, {});
    await queryInterface.bulkDelete('ordenes_compra', null, {});
    await queryInterface.bulkDelete('transportistas', null, {});
    await queryInterface.bulkDelete('clientes', null, {});
  },
};
