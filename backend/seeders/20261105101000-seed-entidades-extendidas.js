'use strict';

const ahora = new Date();

module.exports = {
  async up(queryInterface) {
    const inserciones = [
      { tabla: 'clientes', datos: [{ nombre: 'Retail Norte', email: 'retail@norte.com', telefono: '555-1101', direccion: 'Av. Norte 100', tipo: 'retail', activo: true }] },
      { tabla: 'transportistas', datos: [{ nombre: 'Logística Central', empresa: 'L-Central', telefono: '555-7201', documento: 'DOC-1001', estado: 'activo' }] },
      { tabla: 'ordenes_compra', datos: [{ numero: 'OC-1001', fecha: ahora, id_proveedor: 1, total: 1250.00, estado: 'pendiente' }] },
      { tabla: 'recepciones', datos: [{ codigo: 'RC-1001', fecha: ahora, id_almacen: 1, id_proveedor: 1, estado: 'en_espera', observacion: 'Recepción programada.' }] },
      { tabla: 'ubicaciones', datos: [{ codigo: 'A-01-01', id_almacen: 1, nivel: '1', pasillo: 'A', estanteria: '01', capacidad: 200 }] },
      { tabla: 'lotes', datos: [{ codigo: 'LOT-1001', id_producto: 1, fecha_vencimiento: new Date(Date.now() + 86400000 * 90), cantidad: 150, estado: 'activo' }] },
      { tabla: 'auditorias', datos: [{ fecha: ahora, tipo: 'inventario', responsable: 'Supervisor', detalle: 'Auditoría de stock.', id_almacen: 1 }] },
      { tabla: 'incidencias', datos: [{ titulo: 'Fallo de escáner', descripcion: 'Escáner de salida no responde.', severidad: 'media', estado: 'abierta', id_usuario: 1 }] },
      { tabla: 'turnos', datos: [{ nombre: 'Mañana', fecha_inicio: ahora, fecha_fin: null, id_usuario: 1, estado: 'activo' }] },
      { tabla: 'paquetes', datos: [{ codigo: 'PK-1001', id_pedido: 1, id_transportista: 1, peso: 15.5, estado: 'preparado', destino: 'CD Central' }] },
      { tabla: 'etiquetas', datos: [{ codigo: 'ET-1001', tipo: 'inventario', id_producto: 1, id_almacen: 1 }] },
      { tabla: 'tarifas', datos: [{ concepto: 'Almacenaje mensual', monto: 120.00, vigencia_inicio: ahora, vigencia_fin: null, activo: true }] },
      { tabla: 'contratos', datos: [{ numero: 'CTR-1001', id_proveedor: 1, id_almacen: 1, fecha_inicio: ahora, fecha_fin: null, estado: 'activo' }] },
      { tabla: 'inventario_critico', datos: [{ id_producto: 1, umbral_minimo: 25, stock_actual: 18, prioridad: 'alta', estado: 'alerta' }] },
      { tabla: 'pedidos_internos', datos: [{ codigo: 'PI-1001', id_almacen_origen: 1, id_almacen_destino: 1, estado: 'pendiente', total: 420.50 }] },
      { tabla: 'costos', datos: [{ concepto: 'Flete local', monto: 85.00, id_almacen: 1, id_producto: 1, periodo: '2026-11' }] },
      { tabla: 'permisos', datos: [{ nombre: 'Gestión de inventario', modulo: 'inventario', rol: 'admin', activo: true }] },
    ];

    for (const { tabla, datos } of inserciones) {
      try {
        await queryInterface.bulkInsert(tabla, datos, { ignoreDuplicates: true });
      } catch (error) {
        console.error(`⚠️  No se pudo insertar en ${tabla}: ${error.message}`);
      }
    }

    console.log('✅ Seed de entidades extendidas completado.');
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
