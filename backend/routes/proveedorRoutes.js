const express = require('express');
const ctrl = require('../controllers/proveedorController');
const { validarId } = require('../validators/common');
const {
  validarCrearProveedor,
  validarActualizarProveedor,
} = require('../validators/proveedorValidator');
const { autorizar } = require('../middleware/auth');

const router = express.Router();
router.param('id', validarId);
router.get('/', autorizar('admin', 'supervisor'), ctrl.listar);
router.get('/:id', autorizar('admin', 'supervisor'), ctrl.obtener);
router.post('/', autorizar('admin'), validarCrearProveedor, ctrl.crear);
router.put('/:id', autorizar('admin'), validarActualizarProveedor, ctrl.actualizar);
router.delete('/:id', autorizar('admin'), ctrl.eliminar);

module.exports = router;
