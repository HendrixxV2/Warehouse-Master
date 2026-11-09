const express = require('express');
const ctrl = require('../controllers/almacenController');
const { validarId } = require('../validators/common');
const {
  validarCrearAlmacen,
  validarActualizarAlmacen,
} = require('../validators/almacenValidator');
const { autorizar } = require('../middleware/auth');

const router = express.Router();
router.param('id', validarId);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', autorizar('admin'), validarCrearAlmacen, ctrl.crear);
router.put('/:id', autorizar('admin'), validarActualizarAlmacen, ctrl.actualizar);
router.delete('/:id', autorizar('admin'), ctrl.eliminar);

module.exports = router;
