// backend/routes/movimientoStockRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/movimientoStockController');
const { validarId } = require('../validators/common');
const {
  validarCrearMovimiento,
  validarActualizarMovimiento,
} = require('../validators/movimientoStockValidator');
const { autorizar } = require('../middleware/auth');

router.param('id', validarId);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', autorizar('supervisor', 'operador'), (req, res, next) => {
  if (req.user.rol === 'operador') req.body.id_usuario = req.user.id;
  next();
}, validarCrearMovimiento, ctrl.crear);
router.put('/:id', autorizar('supervisor'), validarActualizarMovimiento, ctrl.actualizar);
router.delete('/:id', autorizar('supervisor'), ctrl.eliminar);

module.exports = router;