const express = require('express');
const { validarId } = require('../validators/common');
const { crearControladorRecurso } = require('../controllers/resourceController');
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

function crearRutaRecurso(model, fields, include = []) {
  const router = express.Router();
  const ctrl = crearControladorRecurso({ model, fields, include });

  router.param('id', validarId);
  router.get('/', ctrl.listar);
  router.get('/:id', ctrl.obtener);
  router.post('/', ctrl.crear);
  router.put('/:id', ctrl.actualizar);
  router.patch('/:id', ctrl.actualizar);
  router.delete('/:id', ctrl.eliminar);

  return router;
}

const router = express.Router();

router.use('/clientes', crearRutaRecurso(Cliente, ['nombre', 'email', 'telefono', 'direccion', 'tipo', 'activo']));
router.use('/transportistas', crearRutaRecurso(Transportista, ['nombre', 'empresa', 'telefono', 'documento', 'estado']));
router.use('/ordenes-compra', crearRutaRecurso(OrdenCompra, ['numero', 'fecha', 'id_proveedor', 'total', 'estado']));
router.use('/recepciones', crearRutaRecurso(Recepcion, ['codigo', 'fecha', 'id_almacen', 'id_proveedor', 'estado', 'observacion']));
router.use('/ubicaciones', crearRutaRecurso(Ubicacion, ['codigo', 'id_almacen', 'nivel', 'pasillo', 'estanteria', 'capacidad']));
router.use('/lotes', crearRutaRecurso(Lote, ['codigo', 'id_producto', 'fecha_vencimiento', 'cantidad', 'estado']));
router.use('/auditorias', crearRutaRecurso(Auditoria, ['fecha', 'tipo', 'responsable', 'detalle', 'id_almacen']));
router.use('/incidencias', crearRutaRecurso(Incidencia, ['titulo', 'descripcion', 'severidad', 'estado', 'id_usuario']));
router.use('/turnos', crearRutaRecurso(Turno, ['nombre', 'fecha_inicio', 'fecha_fin', 'id_usuario', 'estado']));
router.use('/paquetes', crearRutaRecurso(Paquete, ['codigo', 'id_pedido', 'id_transportista', 'peso', 'estado', 'destino']));
router.use('/etiquetas', crearRutaRecurso(Etiqueta, ['codigo', 'tipo', 'id_producto', 'id_almacen']));
router.use('/tarifas', crearRutaRecurso(Tarifa, ['concepto', 'monto', 'vigencia_inicio', 'vigencia_fin', 'activo']));
router.use('/contratos', crearRutaRecurso(Contrato, ['numero', 'id_proveedor', 'id_almacen', 'fecha_inicio', 'fecha_fin', 'estado']));
router.use('/inventario-critico', crearRutaRecurso(InventarioCritico, ['id_producto', 'umbral_minimo', 'stock_actual', 'prioridad', 'estado']));
router.use('/pedidos-internos', crearRutaRecurso(PedidoInterno, ['codigo', 'id_almacen_origen', 'id_almacen_destino', 'estado', 'total']));
router.use('/costos', crearRutaRecurso(Costo, ['concepto', 'monto', 'id_almacen', 'id_producto', 'periodo']));
router.use('/permisos', crearRutaRecurso(Permiso, ['nombre', 'modulo', 'rol', 'activo']));

module.exports = router;
