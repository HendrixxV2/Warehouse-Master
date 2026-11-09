const express = require('express');
const ctrl = require('../controllers/productoController');
const { validarId } = require('../validators/common');
const {
  validarCrearProducto,
  validarActualizarProducto,
} = require('../validators/productoValidator');
const { autorizar } = require('../middleware/auth');

const router = express.Router();
router.param('id', validarId);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', autorizar('admin'), validarCrearProducto, ctrl.crear);
router.put('/:id', autorizar('admin'), validarActualizarProducto, ctrl.actualizar);
router.patch('/:id', autorizar('admin'), validarActualizarProducto, ctrl.actualizar);
router.delete('/:id', autorizar('admin'), ctrl.eliminar);
module.exports = router;
