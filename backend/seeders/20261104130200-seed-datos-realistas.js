'use strict';

/**
 * Seeder con datos realistas para todas las tablas del WMS.
 * Datos en español, coherentes con el esquema de base de datos.
 */

const bcrypt = require('bcryptjs');
const { sequelize } = require('../models');

module.exports = {
  async up() {
    const CONTRASENIA_POR_DEFECTO = await bcrypt.hash('WarehouseDemo123', 10);
    await sequelize.transaction(async (transaction) => {
      // =====================================================================
      // 1. CATEGORÍAS
      // =====================================================================
      const categoriasData = [
        { nombre: 'Electrónica', descripcion: 'Dispositivos electrónicos y componentes' },
        { nombre: 'Informática', descripcion: 'Equipos y accesorios de computación' },
        { nombre: 'Oficina', descripcion: 'Mobiliario y suministros de oficina' },
        { nombre: 'Limpieza', descripcion: 'Productos de limpieza e higiene' },
        { nombre: 'Almacenamiento', descripcion: 'Estanterías y sistemas de almacenaje' },
        { nombre: 'Embalaje', descripcion: 'Cajas, cintas y materiales de embalaje' },
        { nombre: 'Herramientas', descripcion: 'Herramientas manuales y eléctricas' },
        { nombre: 'Seguridad', descripcion: 'Equipos de protección y seguridad industrial' },
        { nombre: 'Mantenimiento', descripcion: 'Repuestos y suministros de mantenimiento' },
        { nombre: 'Papelería', descripcion: 'Artículos de papelería y escritura' },
      ];

      const categorias = {};
      for (const cat of categoriasData) {
        const [record] = await sequelize.models.Categoria.findOrCreate({
          where: { nombre: cat.nombre },
          defaults: cat,
          transaction,
        });
        categorias[cat.nombre] = record.id;
      }

      // =====================================================================
      // 2. PROVEEDORES
      // =====================================================================
      const proveedoresData = [
        { nombre: 'TecnoDistribución S.A.', email: 'ventas@tecno-dist.com', telefono: '+52 55 1234 5678', direccion: 'Av. Tecnológico 123, Col. Industrial, CDMX' },
        { nombre: 'OficinaExpress S.R.L.', email: 'contacto@oficinaexpress.com', telefono: '+52 55 2345 6789', direccion: 'Calle de la Oficina 456, Col. Centro, CDMX' },
        { nombre: 'LimpiezaPro', email: 'info@limpiezapro.com', telefono: '+52 55 3456 7890', direccion: 'Blvd. Limpieza 789, Col. Sanitaria, Estado de México' },
        { nombre: 'Ferretería Central', email: 'pedidos@ferreteriacentral.com', telefono: '+52 55 4567 8901', direccion: 'Av. Ferrocarril 321, Col. Obrera, CDMX' },
        { nombre: 'Embalajes del Norte', email: 'ventas@embalajesnorte.com', telefono: '+52 55 5678 9012', direccion: 'Carretera Norte km 15, Col. Industrial Norte, Estado de México' },
        { nombre: 'Suministros Industriales', email: 'admin@suminind.com', telefono: '+52 55 6789 0123', direccion: 'Parque Industrial 654, Col. Industrial, Querétaro' },
        { nombre: 'Papelería Moderna', email: 'contacto@papeleriamoderna.com', telefono: '+52 55 7890 1234', direccion: 'Calle Papelera 987, Col. Roma, CDMX' },
        { nombre: 'Seguridad Total', email: 'ventas@seguridadtotal.com', telefono: '+52 55 8901 2345', direccion: 'Av. Seguridad 147, Col. Polanco, CDMX' },
      ];

      const proveedores = {};
      for (const prov of proveedoresData) {
        const [record] = await sequelize.models.Proveedor.findOrCreate({
          where: { email: prov.email },
          defaults: prov,
          transaction,
        });
        proveedores[prov.nombre] = record.id;
      }

      // =====================================================================
      // 3. ALMACENES
      // =====================================================================
      const almacenesData = [
        { nombre: 'Almacén Central', ubicacion: 'Zona industrial norte', capacidad: 5000 },
        { nombre: 'Almacén Norte', ubicacion: 'Avenida principal km 5', capacidad: 3000 },
        { nombre: 'Almacén Sur', ubicacion: 'Parque industrial sur', capacidad: 4000 },
        { nombre: 'Almacén Poniente', ubicacion: 'Calle 10 entre 5ta y 6ta', capacidad: 2500 },
        { nombre: 'Almacén Oriente', ubicacion: 'Sector logístico este', capacidad: 3500 },
      ];

      const almacenes = {};
      for (const alm of almacenesData) {
        const [record] = await sequelize.models.Almacen.findOrCreate({
          where: { nombre: alm.nombre },
          defaults: alm,
          transaction,
        });
        almacenes[alm.nombre] = record.id;
      }

      // =====================================================================
      // 4. USUARIOS
      // =====================================================================
      const usuariosData = [
        { nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@empresa.com', rol: 'admin' },
        { nombre: 'María González', email: 'maria.gonzalez@empresa.com', rol: 'supervisor' },
        { nombre: 'Ana López', email: 'ana.lopez@empresa.com', rol: 'supervisor' },
        { nombre: 'Juan Pérez', email: 'juan.perez@empresa.com', rol: 'operador' },
        { nombre: 'Laura Sánchez', email: 'laura.sanchez@empresa.com', rol: 'operador' },
        { nombre: 'Roberto Díaz', email: 'roberto.diaz@empresa.com', rol: 'operador' },
      ];

      const usuarios = {};
      for (const user of usuariosData) {
        const [record] = await sequelize.models.Usuario.findOrCreate({
          where: { email: user.email },
          defaults: { ...user, password: CONTRASENIA_POR_DEFECTO },
          transaction,
        });
        usuarios[user.nombre] = record.id;
      }

      // =====================================================================
      // 5. PRODUCTOS
      // =====================================================================
      const productosData = [
        { nombre: 'Monitor LED 24" Full HD', precio: 2850.00, stock_actual: 45, categoria: 'Electrónica', proveedor: 'TecnoDistribución S.A.', almacen: 'Almacén Central' },
        { nombre: 'Teclado Inalámbrico Ergonómico', precio: 650.00, stock_actual: 120, categoria: 'Electrónica', proveedor: 'TecnoDistribución S.A.', almacen: 'Almacén Central' },
        { nombre: 'Mouse Óptico USB', precio: 320.00, stock_actual: 200, categoria: 'Electrónica', proveedor: 'TecnoDistribución S.A.', almacen: 'Almacén Norte' },
        { nombre: 'Webcam 1080p con Micrófono', precio: 1150.00, stock_actual: 60, categoria: 'Electrónica', proveedor: 'TecnoDistribución S.A.', almacen: 'Almacén Central' },
        { nombre: 'Laptop i5 8GB RAM 256GB SSD', precio: 12500.00, stock_actual: 18, categoria: 'Informática', proveedor: 'TecnoDistribución S.A.', almacen: 'Almacén Central' },
        { nombre: 'Disco Duro Externo 1TB USB 3.0', precio: 1850.00, stock_actual: 55, categoria: 'Informática', proveedor: 'TecnoDistribución S.A.', almacen: 'Almacén Norte' },
        { nombre: 'Memoria USB 64GB USB 3.0', precio: 280.00, stock_actual: 300, categoria: 'Informática', proveedor: 'TecnoDistribución S.A.', almacen: 'Almacén Norte' },
        { nombre: 'Impresora Multifunción Tinta', precio: 3450.00, stock_actual: 22, categoria: 'Informática', proveedor: 'OficinaExpress S.R.L.', almacen: 'Almacén Sur' },
        { nombre: 'Silla Ergonómica de Oficina', precio: 2950.00, stock_actual: 35, categoria: 'Oficina', proveedor: 'OficinaExpress S.R.L.', almacen: 'Almacén Sur' },
        { nombre: 'Escritorio Ejecutivo Madera', precio: 4500.00, stock_actual: 15, categoria: 'Oficina', proveedor: 'OficinaExpress S.R.L.', almacen: 'Almacén Sur' },
        { nombre: 'Archivero de Metal 3 Gavetas', precio: 2200.00, stock_actual: 28, categoria: 'Oficina', proveedor: 'OficinaExpress S.R.L.', almacen: 'Almacén Poniente' },
        { nombre: 'Detergente Líquido 5L', precio: 180.00, stock_actual: 150, categoria: 'Limpieza', proveedor: 'LimpiezaPro', almacen: 'Almacén Poniente' },
        { nombre: 'Desinfectante en Spray 1L', precio: 95.00, stock_actual: 200, categoria: 'Limpieza', proveedor: 'LimpiezaPro', almacen: 'Almacén Poniente' },
        { nombre: 'Papel Higiénico Paquete 12 Rolos', precio: 145.00, stock_actual: 300, categoria: 'Limpieza', proveedor: 'LimpiezaPro', almacen: 'Almacén Oriente' },
        { nombre: 'Jabón Líquido para Manos 5L', precio: 220.00, stock_actual: 90, categoria: 'Limpieza', proveedor: 'LimpiezaPro', almacen: 'Almacén Oriente' },
        { nombre: 'Estantería Metálica 5 Niveles', precio: 3800.00, stock_actual: 12, categoria: 'Almacenamiento', proveedor: 'Suministros Industriales', almacen: 'Almacén Oriente' },
        { nombre: 'Bacín de Plástico con Tapa', precio: 450.00, stock_actual: 80, categoria: 'Almacenamiento', proveedor: 'Suministros Industriales', almacen: 'Almacén Oriente' },
        { nombre: 'Carrito de Carga Plegable', precio: 1650.00, stock_actual: 20, categoria: 'Almacenamiento', proveedor: 'Suministros Industriales', almacen: 'Almacén Sur' },
        { nombre: 'Caja de Cartón 40x30x30 cm (paquete 25)', precio: 550.00, stock_actual: 60, categoria: 'Embalaje', proveedor: 'Embalajes del Norte', almacen: 'Almacén Poniente' },
        { nombre: 'Cinta de Empacar 48mm x 100m', precio: 65.00, stock_actual: 250, categoria: 'Embalaje', proveedor: 'Embalajes del Norte', almacen: 'Almacén Poniente' },
        { nombre: 'Plástico de Burbujas 50cm x 100m', precio: 420.00, stock_actual: 45, categoria: 'Embalaje', proveedor: 'Embalajes del Norte', almacen: 'Almacén Norte' },
        { nombre: 'Film Estirable para Pallet 500m', precio: 380.00, stock_actual: 35, categoria: 'Embalaje', proveedor: 'Embalajes del Norte', almacen: 'Almacén Norte' },
        { nombre: 'Taladro Eléctrico 13mm 600W', precio: 1850.00, stock_actual: 15, categoria: 'Herramientas', proveedor: 'Ferretería Central', almacen: 'Almacén Sur' },
        { nombre: 'Juego de Destornilladores 6 piezas', precio: 380.00, stock_actual: 70, categoria: 'Herramientas', proveedor: 'Ferretería Central', almacen: 'Almacén Sur' },
        { nombre: 'Cinta Métrica 5 metros', precio: 120.00, stock_actual: 100, categoria: 'Herramientas', proveedor: 'Ferretería Central', almacen: 'Almacén Poniente' },
        { nombre: 'Linterna LED Recargable', precio: 280.00, stock_actual: 60, categoria: 'Herramientas', proveedor: 'Ferretería Central', almacen: 'Almacén Poniente' },
        { nombre: 'Casco de Seguridad Blanco', precio: 150.00, stock_actual: 200, categoria: 'Seguridad', proveedor: 'Seguridad Total', almacen: 'Almacén Central' },
        { nombre: 'Gafas de Seguridad Transparentes', precio: 85.00, stock_actual: 150, categoria: 'Seguridad', proveedor: 'Seguridad Total', almacen: 'Almacén Central' },
        { nombre: 'Guantes de Nitrile Talla M', precio: 95.00, stock_actual: 300, categoria: 'Seguridad', proveedor: 'Seguridad Total', almacen: 'Almacén Norte' },
        { nombre: 'Chaleco Reflectante Amarillo', precio: 220.00, stock_actual: 120, categoria: 'Seguridad', proveedor: 'Seguridad Total', almacen: 'Almacén Norte' },
        { nombre: 'Aceite Lubricante Industrial 1L', precio: 320.00, stock_actual: 60, categoria: 'Mantenimiento', proveedor: 'Suministros Industriales', almacen: 'Almacén Sur' },
        { nombre: 'Filtro de Aire para Compresor', precio: 450.00, stock_actual: 30, categoria: 'Mantenimiento', proveedor: 'Suministros Industriales', almacen: 'Almacén Sur' },
        { nombre: 'Batería Alcalina AA (paquete 10)', precio: 180.00, stock_actual: 80, categoria: 'Mantenimiento', proveedor: 'Suministros Industriales', almacen: 'Almacén Oriente' },
        { nombre: 'Resma de Papel Carta 500 hojas', precio: 150.00, stock_actual: 100, categoria: 'Papelería', proveedor: 'Papelería Moderna', almacen: 'Almacén Oriente' },
        { nombre: 'Carpetas de Cartón (paquete 25)', precio: 280.00, stock_actual: 40, categoria: 'Papelería', proveedor: 'Papelería Moderna', almacen: 'Almacén Oriente' },
        { nombre: 'Marcadores Pizarra (set 6 colores)', precio: 120.00, stock_actual: 90, categoria: 'Papelería', proveedor: 'Papelería Moderna', almacen: 'Almacén Central' },
      ];

      const productos = {};
      for (const prod of productosData) {
        const [record] = await sequelize.models.Producto.findOrCreate({
          where: { nombre: prod.nombre },
          defaults: {
            nombre: prod.nombre,
            precio: prod.precio,
            stock_actual: prod.stock_actual,
            id_proveedor: proveedores[prod.proveedor],
            id_categoria: categorias[prod.categoria],
            id_almacen: almacenes[prod.almacen],
          },
          transaction,
        });
        productos[prod.nombre] = record;
      }

      // =====================================================================
      // 6. MOVIMIENTOS DE STOCK
      // =====================================================================
      const ahora = new Date();
      const tresMesesAtras = new Date();
      tresMesesAtras.setMonth(ahora.getMonth() - 3);

      const fechaAleatoria = (inicio, fin) => {
        return new Date(inicio.getTime() + Math.random() * (fin.getTime() - inicio.getTime()));
      };

      const nombresProductos = Object.keys(productos);
      const nombresUsuarios = Object.keys(usuarios);
      const movimientosData = [];

      for (let i = 0; i < 40; i++) {
        const tipo = Math.random() < 0.5 ? 'entrada' : 'salida';
        const productoIndex = Math.floor(Math.random() * nombresProductos.length);
        const productoNombre = nombresProductos[productoIndex];
        const producto = productos[productoNombre];
        const cantidad = Math.floor(Math.random() * 50) + 5;
        const usuarioIndex = Math.floor(Math.random() * nombresUsuarios.length);
        const usuarioNombre = nombresUsuarios[usuarioIndex];

        movimientosData.push({
          tipo,
          cantidad,
          fecha: fechaAleatoria(tresMesesAtras, ahora),
          id_usuario: usuarios[usuarioNombre],
          id_producto: producto.id,
        });
      }

      for (const mov of movimientosData) {
        await sequelize.models.MovimientoStock.create(mov, { transaction });
      }

      // =====================================================================
      // 7. PEDIDOS
      // =====================================================================
      const estados = ['pendiente', 'procesando', 'completado', 'cancelado'];
      const pedidosData = [];

      for (let i = 0; i < 15; i++) {
        const usuarioIndex = Math.floor(Math.random() * nombresUsuarios.length);
        const usuarioNombre = nombresUsuarios[usuarioIndex];
        const estado = estados[Math.floor(Math.random() * estados.length)];
        const fecha = fechaAleatoria(tresMesesAtras, ahora);

        pedidosData.push({
          fecha,
          estado,
          total: 0,
          id_usuario: usuarios[usuarioNombre],
        });
      }

      const pedidosCreados = [];
      for (const ped of pedidosData) {
        const creado = await sequelize.models.Pedido.create(ped, { transaction });
        pedidosCreados.push(creado);
      }

      // =====================================================================
      // 8. DETALLES DE PEDIDO
      // =====================================================================
      for (const pedido of pedidosCreados) {
        const numDetalles = Math.floor(Math.random() * 4) + 1;
        let totalPedido = 0;
        const productosUsados = new Set();

        for (let j = 0; j < numDetalles; j++) {
          let productoIndex;
          do {
            productoIndex = Math.floor(Math.random() * nombresProductos.length);
          } while (productosUsados.has(productoIndex) && productosUsados.size < nombresProductos.length);
          productosUsados.add(productoIndex);

          const productoNombre = nombresProductos[productoIndex];
          const producto = productos[productoNombre];
          const cantidad = Math.floor(Math.random() * 10) + 1;
          const precioUnitario = producto.precio;
          const subtotal = parseFloat((cantidad * precioUnitario).toFixed(2));

          await sequelize.models.DetallePedido.create({
            cantidad,
            precio_unitario: precioUnitario,
            subtotal,
            id_pedido: pedido.id,
            id_producto: producto.id,
          }, { transaction });

          totalPedido += subtotal;
        }

        await pedido.update({ total: parseFloat(totalPedido.toFixed(2)) }, { transaction });
      }

      console.log('✅ Seed de datos realistas completado con éxito.');
    });
  },

  async down() {
    await sequelize.transaction(async (transaction) => {
      await sequelize.models.DetallePedido.destroy({ where: {}, transaction });
      await sequelize.models.Pedido.destroy({ where: {}, transaction });
      await sequelize.models.MovimientoStock.destroy({ where: {}, transaction });
      await sequelize.models.Producto.destroy({ where: {}, transaction });
      await sequelize.models.Usuario.destroy({ where: {}, transaction });
      await sequelize.models.Almacen.destroy({ where: {}, transaction });
      await sequelize.models.Proveedor.destroy({ where: {}, transaction });
      await sequelize.models.Categoria.destroy({ where: {}, transaction });

      console.log('🗑️  Seed de datos realistas revertido.');
    });
  },
};