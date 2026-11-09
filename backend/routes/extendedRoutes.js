const express = require('express');
const { validarId } = require('../validators/common');
const { crearControladorRecurso } = require('../controllers/resourceController');
const { autorizar } = require('../middleware/auth');
const {
  Cliente,
  Transportista,
  OrdenCompra,
  Recepcion,
  Ubicacion,
  Lote,
  Auditoria,
  Incidencia,
  Turno,
  Paquete,
  Etiqueta,
  Tarifa,
  Contrato,
  InventarioCritico,
  PedidoInterno,
  Costo,
  Permiso,
} = require('../models');

const ROLES = {
  todos: ['admin', 'supervisor', 'operador'],
  gestion: ['admin', 'supervisor'],
  admin: ['admin'],
  supervision: ['supervisor'],
  operaciones: ['supervisor', 'operador'],
  supervisionMaestros: ['admin', 'supervisor'],
};

function crearRutaRecurso(model, fields, access = {}) {
  const router = express.Router();
  const ctrl = crearControladorRecurso({ model, fields });
  const permiso = (action) => autorizar(...(access[action] || ROLES.admin));

  router.param('id', validarId);
  router.get('/', permiso('read'), ctrl.listar);
  router.get('/:id', permiso('read'), ctrl.obtener);
  router.post('/', permiso('create'), ctrl.crear);
  router.put('/:id', permiso('update'), ctrl.actualizar);
  router.patch('/:id', permiso('update'), ctrl.actualizar);
  router.delete('/:id', permiso('delete'), ctrl.eliminar);

  return router;
}

const router = express.Router();

router.use('/clientes', crearRutaRecurso(Cliente, ['nombre', 'email', 'telefono', 'direccion', 'tipo', 'activo'], {
  read: ROLES.gestion,
  create: ROLES.admin,
  update: ROLES.admin,
  delete: ROLES.admin,
}));
router.use('/transportistas', crearRutaRecurso(Transportista, ['nombre', 'empresa', 'telefono', 'documento', 'estado'], {
  read: ROLES.gestion,
  create: ROLES.admin,
  update: ROLES.admin,
  delete: ROLES.admin,
}));
router.use('/ordenes-compra', crearRutaRecurso(OrdenCompra, ['numero', 'fecha', 'id_proveedor', 'total', 'estado'], {
  read: ROLES.gestion,
  create: ROLES.supervision,
  update: ROLES.supervision,
  delete: ROLES.supervision,
}));
router.use('/recepciones', (req, res, next) => {
  if (['PUT', 'PATCH'].includes(req.method) && req.user.rol === 'operador') {
    req.body = { estado: req.body.estado, observacion: req.body.observacion };
  }
  next();
}, crearRutaRecurso(Recepcion, ['codigo', 'fecha', 'id_almacen', 'id_proveedor', 'estado', 'observacion'], {
  read: ROLES.operaciones,
  create: ROLES.operaciones,
  update: ROLES.operaciones,
  delete: ROLES.supervision,
}));
router.use('/ubicaciones', crearRutaRecurso(Ubicacion, ['codigo', 'id_almacen', 'nivel', 'pasillo', 'estanteria', 'capacidad'], {
  read: ROLES.todos,
  create: ROLES.admin,
  update: ROLES.admin,
  delete: ROLES.admin,
}));
router.use('/lotes', crearRutaRecurso(Lote, ['codigo', 'id_producto', 'fecha_vencimiento', 'cantidad', 'estado'], {
  read: ROLES.supervisionMaestros,
  create: ROLES.supervisionMaestros,
  update: ROLES.supervisionMaestros,
  delete: ROLES.admin,
}));
router.use('/auditorias', crearRutaRecurso(Auditoria, ['fecha', 'tipo', 'responsable', 'detalle', 'id_almacen'], {
  read: ROLES.admin,
  create: ROLES.admin,
  update: [],
  delete: [],
}));
router.use('/incidencias', (req, res, next) => {
  if (req.method === 'POST' && req.user.rol === 'operador') {
    req.body = { ...req.body, id_usuario: req.user.id, estado: 'abierta' };
  }
  next();
}, crearRutaRecurso(Incidencia, ['titulo', 'descripcion', 'severidad', 'estado', 'id_usuario'], {
  read: ROLES.gestion,
  create: ROLES.operaciones,
  update: ROLES.supervision,
  delete: ROLES.supervision,
}));
router.use('/turnos', crearRutaRecurso(Turno, ['nombre', 'fecha_inicio', 'fecha_fin', 'id_usuario', 'estado'], {
  read: ROLES.supervision,
  create: ROLES.supervision,
  update: ROLES.supervision,
  delete: ROLES.supervision,
}));
router.use('/paquetes', (req, res, next) => {
  if (['PUT', 'PATCH'].includes(req.method) && req.user.rol === 'operador') {
    req.body = { peso: req.body.peso, estado: req.body.estado };
  }
  next();
}, crearRutaRecurso(Paquete, ['codigo', 'id_pedido', 'id_transportista', 'peso', 'estado', 'destino'], {
  read: ROLES.operaciones,
  create: ROLES.operaciones,
  update: ROLES.operaciones,
  delete: ROLES.supervision,
}));
router.use('/etiquetas', crearRutaRecurso(Etiqueta, ['codigo', 'tipo', 'id_producto', 'id_almacen'], {
  read: ROLES.operaciones,
  create: ROLES.supervisionMaestros,
  update: ROLES.supervisionMaestros,
  delete: ROLES.admin,
}));
router.use('/tarifas', crearRutaRecurso(Tarifa, ['concepto', 'monto', 'vigencia_inicio', 'vigencia_fin', 'activo'], {
  read: ROLES.admin,
  create: ROLES.admin,
  update: ROLES.admin,
  delete: ROLES.admin,
}));
router.use('/contratos', crearRutaRecurso(Contrato, ['numero', 'id_proveedor', 'id_almacen', 'fecha_inicio', 'fecha_fin', 'estado'], {
  read: ROLES.admin,
  create: ROLES.admin,
  update: ROLES.admin,
  delete: ROLES.admin,
}));
router.use('/inventario-critico', crearRutaRecurso(InventarioCritico, ['id_producto', 'umbral_minimo', 'stock_actual', 'prioridad', 'estado'], {
  read: ROLES.todos,
  create: ROLES.supervisionMaestros,
  update: ROLES.supervisionMaestros,
  delete: ROLES.admin,
}));
router.use('/pedidos-internos', crearRutaRecurso(PedidoInterno, ['codigo', 'id_almacen_origen', 'id_almacen_destino', 'estado', 'total'], {
  read: ROLES.supervision,
  create: ROLES.supervision,
  update: ROLES.supervision,
  delete: ROLES.supervision,
}));
router.use('/costos', crearRutaRecurso(Costo, ['concepto', 'monto', 'id_almacen', 'id_producto', 'periodo'], {
  read: ROLES.admin,
  create: ROLES.admin,
  update: ROLES.admin,
  delete: ROLES.admin,
}));
router.use('/permisos', crearRutaRecurso(Permiso, ['nombre', 'modulo', 'rol', 'activo'], {
  read: ROLES.admin,
  create: [],
  update: [],
  delete: [],
}));

module.exports = router;
