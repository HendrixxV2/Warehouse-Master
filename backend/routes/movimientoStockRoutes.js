// backend/routes/movimientoStockRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/movimientoStockController');
const { validarId } = require('../validators/common');
const {
  validarCrearMovimiento,
  validarActualizarMovimiento,
} = require('../validators/movimientoStockValidator');

router.param('id', validarId);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', validarCrearMovimiento, ctrl.crear);
router.put('/:id', validarActualizarMovimiento, ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;