const express = require('express');
const ctrl = require('../controllers/detallePedidoController');
const { validarId } = require('../validators/common');
const {
  validarCrearDetalle,
  validarActualizarDetalle,
} = require('../validators/detallePedidoValidator');

const router = express.Router();
router.param('id', validarId);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', validarCrearDetalle, ctrl.crear);
router.put('/:id', validarActualizarDetalle, ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
