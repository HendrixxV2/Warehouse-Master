const express = require('express');
const ctrl = require('../controllers/pedidoController');
const { validarId } = require('../validators/common');
const {
  validarCrearPedido,
  validarActualizarPedido,
} = require('../validators/pedidoValidator');

const router = express.Router();
router.param('id', validarId);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', validarCrearPedido, ctrl.crear);
router.put('/:id', validarActualizarPedido, ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
