const express = require('express');
const ctrl = require('../controllers/proveedorController');
const { validarId } = require('../validators/common');
const {
  validarCrearProveedor,
  validarActualizarProveedor,
} = require('../validators/proveedorValidator');

const router = express.Router();
router.param('id', validarId);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', validarCrearProveedor, ctrl.crear);
router.put('/:id', validarActualizarProveedor, ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
