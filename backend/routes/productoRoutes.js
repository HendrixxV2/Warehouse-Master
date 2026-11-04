const express = require('express');
const ctrl = require('../controllers/productoController');
const { validarId } = require('../validators/common');
const {
  validarCrearProducto,
  validarActualizarProducto,
} = require('../validators/productoValidator');

const router = express.Router();
router.param('id', validarId);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', validarCrearProducto, ctrl.crear);
router.put('/:id', validarActualizarProducto, ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
