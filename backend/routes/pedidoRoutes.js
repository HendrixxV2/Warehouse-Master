const express = require('express');
const ctrl = require('../controllers/pedidoController');
const { validarId } = require('../validators/common');
const {
  validarCrearPedido,
  validarActualizarPedido,
} = require('../validators/pedidoValidator');
const { autorizar } = require('../middleware/auth');

const router = express.Router();
router.param('id', validarId);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', autorizar('supervisor'), validarCrearPedido, ctrl.crear);
router.put('/:id', (req, res, next) => {
  if (req.user.rol === 'operador') {
    req.body = { estado: req.body.estado };
  }
  next();
}, autorizar('supervisor', 'operador'), validarActualizarPedido, ctrl.actualizar);
router.delete('/:id', autorizar('supervisor'), ctrl.eliminar);

module.exports = router;
