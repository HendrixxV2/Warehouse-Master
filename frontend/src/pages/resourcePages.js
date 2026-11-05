import { api } from '../services/api';

const formatDate = (value) => (
  value ? new Date(value).toLocaleString('es-MX') : '—'
);

export const resourcePages = {
  movimientos: {
    api: api.movimientos,
    title: 'Movimientos',
    description: 'Entradas y salidas de inventario',
    fields: [
      { name: 'tipo', label: 'Tipo', type: 'select', required: true, options: ['entrada', 'salida'] },
      { name: 'cantidad', label: 'Cantidad', type: 'number', min: 1, required: true },
      { name: 'id_usuario', label: 'ID de usuario', type: 'number', min: 1, required: true, createOnly: true },
      { name: 'id_producto', label: 'ID de producto', type: 'number', min: 1, required: true, createOnly: true },
      { name: 'fecha', label: 'Fecha', type: 'datetime-local' },
    ],
    columns: [
      { key: 'id', label: 'ID', mono: true },
      { key: 'tipo', label: 'Tipo' },
      { key: 'cantidad', label: 'Cantidad', align: 'right', mono: true },
      { key: 'id_producto', label: 'Producto', align: 'right', mono: true },
      { key: 'id_usuario', label: 'Usuario', align: 'right', mono: true },
      { key: 'fecha', label: 'Fecha', render: formatDate },
    ],
  },
  pedidos: {
    api: api.pedidos,
    title: 'Pedidos',
    description: 'Pedidos y estado de procesamiento',
    fields: [
      { name: 'id_usuario', label: 'ID de usuario', type: 'number', min: 1, required: true, createOnly: true },
      { name: 'estado', label: 'Estado', type: 'select', options: ['pendiente', 'procesando', 'completado', 'cancelado'] },
      { name: 'fecha', label: 'Fecha', type: 'datetime-local' },
    ],
    columns: [
      { key: 'id', label: 'ID', mono: true },
      { key: 'estado', label: 'Estado' },
      { key: 'total', label: 'Total', align: 'right', mono: true, render: (value) => `$${Number(value || 0).toFixed(2)}` },
      { key: 'id_usuario', label: 'Usuario', align: 'right', mono: true },
      { key: 'fecha', label: 'Fecha', render: formatDate },
    ],
  },
  detalles: {
    api: api.detalles,
    title: 'Detalles',
    description: 'Productos y cantidades de cada pedido',
    fields: [
      { name: 'id_pedido', label: 'ID de pedido', type: 'number', min: 1, required: true, createOnly: true },
      { name: 'id_producto', label: 'ID de producto', type: 'number', min: 1, required: true, createOnly: true },
      { name: 'cantidad', label: 'Cantidad', type: 'number', min: 1, required: true },
    ],
    columns: [
      { key: 'id', label: 'ID', mono: true },
      { key: 'id_pedido', label: 'Pedido', align: 'right', mono: true },
      { key: 'id_producto', label: 'Producto', align: 'right', mono: true },
      { key: 'cantidad', label: 'Cantidad', align: 'right', mono: true },
      { key: 'precio_unitario', label: 'Precio unitario', align: 'right', mono: true, render: (value) => `$${Number(value || 0).toFixed(2)}` },
      { key: 'subtotal', label: 'Subtotal', align: 'right', mono: true, render: (value) => `$${Number(value || 0).toFixed(2)}` },
    ],
  },
  proveedores: {
    api: api.proveedores,
    title: 'Proveedores',
    description: 'Contactos de proveedores',
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'email', label: 'Correo electrónico', type: 'email' },
      { name: 'telefono', label: 'Teléfono', type: 'tel' },
      { name: 'direccion', label: 'Dirección', type: 'text' },
    ],
    columns: [
      { key: 'id', label: 'ID', mono: true },
      { key: 'nombre', label: 'Proveedor' },
      { key: 'email', label: 'Correo' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'direccion', label: 'Dirección' },
    ],
  },
  categorias: {
    api: api.categorias,
    title: 'Categorías',
    description: 'Clasificación del catálogo de productos',
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'descripcion', label: 'Descripción', type: 'textarea' },
    ],
    columns: [
      { key: 'id', label: 'ID', mono: true },
      { key: 'nombre', label: 'Categoría' },
      { key: 'descripcion', label: 'Descripción' },
    ],
  },
  almacenes: {
    api: api.almacenes,
    title: 'Almacenes',
    description: 'Ubicaciones y capacidad de almacenamiento',
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'ubicacion', label: 'Ubicación', type: 'text' },
      { name: 'capacidad', label: 'Capacidad', type: 'number', min: 0 },
    ],
    columns: [
      { key: 'id', label: 'ID', mono: true },
      { key: 'nombre', label: 'Almacén' },
      { key: 'ubicacion', label: 'Ubicación' },
      { key: 'capacidad', label: 'Capacidad', align: 'right', mono: true },
    ],
  },
  usuarios: {
    api: api.usuarios,
    title: 'Usuarios',
    description: 'Usuarios y roles del sistema',
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'email', label: 'Correo electrónico', type: 'email', required: true },
      { name: 'rol', label: 'Rol', type: 'select', options: ['admin', 'supervisor', 'operador'], defaultValue: 'operador' },
    ],
    columns: [
      { key: 'id', label: 'ID', mono: true },
      { key: 'nombre', label: 'Usuario' },
      { key: 'email', label: 'Correo' },
      { key: 'rol', label: 'Rol' },
    ],
  },
};
