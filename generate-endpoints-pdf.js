const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputPath = path.join(__dirname, 'Warehouse-Master-Endpoints.pdf');
const doc = new PDFDocument({
  size: 'A4',
  margin: 48,
  info: {
    Title: 'Warehouse Master - Documentación de endpoints API',
    Author: 'Warehouse Master',
    Subject: 'Guía de pruebas de la API REST',
  },
});

doc.pipe(fs.createWriteStream(outputPath));

const colors = { navy: '#1f2937', blue: '#2563eb', gray: '#4b5563', line: '#d1d5db' };
const methodColors = { GET: '#059669', POST: '#d97706', PUT: '#2563eb', PATCH: '#7c3aed', DELETE: '#dc2626' };

function title(text, size = 16) {
  doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(size).text(text);
  doc.moveDown(0.35);
}

function paragraph(text, size = 9) {
  doc.fillColor(colors.gray).font('Helvetica').fontSize(size).text(text, { lineGap: 2 });
  doc.moveDown(0.35);
}

function code(value) {
  doc.fillColor('#111827').font('Courier').fontSize(7.5).text(value, { indent: 8, lineGap: 1 });
  doc.moveDown(0.25);
}

function endpoint({ method, route, description, body, response, notes, auth = true }) {
  const badgeX = doc.x;
  const badgeY = doc.y;
  doc.roundedRect(badgeX, badgeY, 42, 16, 3).fill(methodColors[method] || colors.navy);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(7.5).text(method, badgeX, badgeY + 4, { width: 42, align: 'center' });
  doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(10).text(route, badgeX + 50, badgeY + 2);
  doc.moveDown(1.35);
  paragraph(description, 8.5);
  doc.fillColor(colors.gray).font('Helvetica-Bold').fontSize(8).text(`Autenticación: ${auth ? 'Bearer token requerido' : 'Pública'}`);
  doc.moveDown(0.25);
  if (body) {
    doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(8).text('Cuerpo de solicitud');
    code(JSON.stringify(body, null, 2));
  }
  if (response) {
    doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(8).text('Respuesta de ejemplo');
    code(JSON.stringify(response, null, 2));
  }
  if (notes) paragraph(notes, 8);
  doc.strokeColor(colors.line).lineWidth(0.5).moveTo(doc.x, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
  doc.moveDown(0.55);
}

function genericResource(resource) {
  title(resource.name, 14);
  paragraph(`Recurso extendido: ${resource.route}. Todos sus endpoints requieren Bearer token.`);
  paragraph(`Campos permitidos: ${resource.fields.join(', ')}.`, 8);
  ['GET /', 'GET /:id', 'POST /', 'PUT /:id', 'PATCH /:id', 'DELETE /:id'].forEach((item) => {
    doc.fillColor(colors.navy).font('Helvetica').fontSize(8.5).text(`${item}  —  ${resource.route}${item.slice(3)}`);
  });
  doc.moveDown(0.25);
  doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(8).text('Ejemplo para POST / PUT / PATCH');
  code(JSON.stringify(resource.example, null, 2));
}

doc.moveDown(3);
doc.fillColor(colors.navy).font('Helvetica-Bold').fontSize(28).text('Warehouse Master', { align: 'center' });
doc.moveDown(0.4);
doc.fillColor(colors.blue).font('Helvetica-Bold').fontSize(17).text('Documentación de Endpoints API', { align: 'center' });
doc.moveDown(1);
paragraph('Guía para probar la API REST del sistema de gestión de almacenes.', 11);
doc.moveDown(1);
title('Información general', 13);
paragraph('Base URL: http://localhost:4000\nFormato: application/json\nAutenticación: JWT mediante Authorization: Bearer <TOKEN>');
title('Inicio rápido', 13);
code('POST /api/auth/login');
code('{ "email": "operador.demo@warehouse.local", "password": "WarehouseDemo123" }');
paragraph('Las credenciales de demostración están disponibles tras ejecutar npm run seed:all. Copia el token devuelto y úsalo en los endpoints protegidos.');

doc.addPage();
title('Autenticación');
endpoint({ method: 'POST', route: '/api/auth/register', description: 'Registra un usuario y genera un token JWT.', auth: false, body: { nombre: 'Juan Pérez', email: 'juan@empresa.com', password: 'ClaveSegura123', rol: 'operador' }, response: { token: 'eyJhbGci...', usuario: { id: 1, nombre: 'Juan Pérez', rol: 'operador' } } });
endpoint({ method: 'POST', route: '/api/auth/login', description: 'Inicia sesión y devuelve un token JWT.', auth: false, body: { email: 'operador.demo@warehouse.local', password: 'WarehouseDemo123' }, response: { token: 'eyJhbGci...', usuario: { id: 1, nombre: 'Operador de demostración', rol: 'operador' } } });
endpoint({ method: 'GET', route: '/api/auth/me', description: 'Obtiene el usuario correspondiente al token enviado.', response: { id: 1, nombre: 'Operador de demostración', email: 'operador.demo@warehouse.local', rol: 'operador' } });

const standardResources = [
  ['Usuarios', '/api/usuarios', { nombre: 'Ana López', email: 'ana@empresa.com', rol: 'operador' }],
  ['Categorías', '/api/categorias', { nombre: 'Electrónica', descripcion: 'Productos electrónicos' }],
  ['Proveedores', '/api/proveedores', { nombre: 'Distribuidora ABC', email: 'contacto@abc.com', telefono: '555-1234' }],
  ['Almacenes', '/api/almacenes', { nombre: 'Almacén Norte', ubicacion: 'Zona Industrial', capacidad: 5000 }],
  ['Productos', '/api/productos', { nombre: 'Laptop HP', precio: 899.99, stock_actual: 10, id_proveedor: 1, id_categoria: 1, id_almacen: 1 }],
  ['Movimientos de stock', '/api/movimientos', { tipo: 'entrada', cantidad: 50, id_usuario: 1, id_producto: 1 }],
  ['Pedidos', '/api/pedidos', { fecha: '2026-11-07', estado: 'pendiente', id_usuario: 1 }],
  ['Detalles de pedido', '/api/detalles', { id_pedido: 1, id_producto: 1, cantidad: 2 }],
];

standardResources.forEach(([name, route, body]) => {
  doc.addPage();
  title(name);
  endpoint({ method: 'GET', route, description: `Lista todos los registros de ${name.toLowerCase()}.`, response: [{ id: 1 }] });
  endpoint({ method: 'GET', route: `${route}/:id`, description: 'Obtiene un registro por ID.', response: { id: 1 } });
  endpoint({ method: 'POST', route, description: 'Crea un registro.', body, response: { id: 1, ...body } });
  endpoint({ method: 'PUT', route: `${route}/:id`, description: 'Actualiza un registro existente.', body });
  if (route === '/api/productos') endpoint({ method: 'PATCH', route: `${route}/:id`, description: 'Actualiza parcialmente un producto.', body: { stock_actual: 20 } });
  endpoint({ method: 'DELETE', route: `${route}/:id`, description: 'Elimina un registro.', notes: 'Respuesta habitual: 204 Sin contenido.' });
});

doc.addPage();
title('Dashboard');
endpoint({ method: 'GET', route: '/api/dashboard/resumen', description: 'Devuelve los indicadores operativos principales.', response: { totalProductos: 25, stockTotal: 1250, stockBajo: 3, pedidosPendientes: 7, movimientosRecientes: [], productosBajos: [] } });

doc.addPage();
title('Servicios');
endpoint({ method: 'POST', route: '/api/services/ai/query', description: 'Consulta al asistente de IA sobre el almacén.', body: { question: '¿Cuáles son los productos con stock bajo?' }, response: { respuesta: '...' } });
endpoint({ method: 'GET', route: '/api/services/forecast/demand', description: 'Devuelve el pronóstico de demanda.', response: { forecast: [] } });
endpoint({ method: 'POST', route: '/api/services/notifications/test-email', description: 'Envía un correo de prueba.', body: { to: 'usuario@empresa.com' }, response: { accepted: ['usuario@empresa.com'] } });

const extended = [
  ['Clientes', '/api/clientes', ['nombre', 'email', 'telefono', 'direccion', 'tipo', 'activo'], { nombre: 'Cliente Corp', email: 'cliente@corp.com', tipo: 'empresa', activo: true }],
  ['Transportistas', '/api/transportistas', ['nombre', 'empresa', 'telefono', 'documento', 'estado'], { nombre: 'TransRápido', empresa: 'TransRápido S.A.', estado: 'activo' }],
  ['Órdenes de compra', '/api/ordenes-compra', ['numero', 'fecha', 'id_proveedor', 'total', 'estado'], { numero: 'OC-001', id_proveedor: 1, total: 5000, estado: 'pendiente' }],
  ['Recepciones', '/api/recepciones', ['codigo', 'fecha', 'id_almacen', 'id_proveedor', 'estado', 'observacion'], { codigo: 'REC-001', id_almacen: 1, id_proveedor: 1, estado: 'completado' }],
  ['Ubicaciones', '/api/ubicaciones', ['codigo', 'id_almacen', 'nivel', 'pasillo', 'estanteria', 'capacidad'], { codigo: 'A-01-01', id_almacen: 1, capacidad: 100 }],
  ['Lotes', '/api/lotes', ['codigo', 'id_producto', 'fecha_vencimiento', 'cantidad', 'estado'], { codigo: 'LOTE-001', id_producto: 1, cantidad: 50, estado: 'activo' }],
  ['Auditorías', '/api/auditorias', ['fecha', 'tipo', 'responsable', 'detalle', 'id_almacen'], { tipo: 'entrada', responsable: 'operador', id_almacen: 1 }],
  ['Incidencias', '/api/incidencias', ['titulo', 'descripcion', 'severidad', 'estado', 'id_usuario'], { titulo: 'Falta de stock', severidad: 'alta', estado: 'abierta', id_usuario: 1 }],
  ['Turnos', '/api/turnos', ['nombre', 'fecha_inicio', 'fecha_fin', 'id_usuario', 'estado'], { nombre: 'Mañana', id_usuario: 1, estado: 'activo' }],
  ['Paquetes', '/api/paquetes', ['codigo', 'id_pedido', 'id_transportista', 'peso', 'estado', 'destino'], { codigo: 'PKG-001', id_pedido: 1, peso: 2.5, estado: 'en_transito' }],
  ['Etiquetas', '/api/etiquetas', ['codigo', 'tipo', 'id_producto', 'id_almacen'], { codigo: 'ETQ-001', tipo: 'codigo_barras', id_producto: 1 }],
  ['Tarifas', '/api/tarifas', ['concepto', 'monto', 'vigencia_inicio', 'vigencia_fin', 'activo'], { concepto: 'Almacenaje', monto: 100.5, activo: true }],
  ['Contratos', '/api/contratos', ['numero', 'id_proveedor', 'id_almacen', 'fecha_inicio', 'fecha_fin', 'estado'], { numero: 'CTR-001', id_proveedor: 1, id_almacen: 1, estado: 'vigente' }],
  ['Inventario crítico', '/api/inventario-critico', ['id_producto', 'umbral_minimo', 'stock_actual', 'prioridad', 'estado'], { id_producto: 1, umbral_minimo: 10, prioridad: 'alta', estado: 'alerta' }],
  ['Pedidos internos', '/api/pedidos-internos', ['codigo', 'id_almacen_origen', 'id_almacen_destino', 'estado', 'total'], { codigo: 'PI-001', id_almacen_origen: 1, id_almacen_destino: 2, estado: 'pendiente' }],
  ['Costos', '/api/costos', ['concepto', 'monto', 'id_almacen', 'id_producto', 'periodo'], { concepto: 'Electricidad', monto: 300, id_almacen: 1, periodo: '2026-11' }],
  ['Permisos', '/api/permisos', ['nombre', 'modulo', 'rol', 'activo'], { nombre: 'Ver reportes', modulo: 'reportes', rol: 'admin', activo: true }],
].map(([name, route, fields, example]) => ({ name, route, fields, example }));

extended.forEach((resource, index) => {
  if (index % 2 === 0) doc.addPage();
  genericResource(resource);
  if (index % 2 === 0) doc.moveDown(0.8);
});

doc.end();
doc.on('end', () => console.log(`PDF generado: ${outputPath}`));
