const express = require('express');
const ctrl = require('../controllers/detallePedidoController');
const { validarId } = require('../validators/common');
const {
  validarCrearDetalle,
  validarActualizarDetalle,
} = require('../validators/detallePedidoValidator');
const { autorizar } = require('../middleware/auth');

const router = express.Router();
router.param('id', validarId);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', autorizar('supervisor'), validarCrearDetalle, ctrl.crear);
router.put('/:id', autorizar('supervisor', 'operador'), validarActualizarDetalle, ctrl.actualizar);
router.delete('/:id', autorizar('supervisor'), ctrl.eliminar);

module.exports = router;
