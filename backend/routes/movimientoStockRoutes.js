// backend/routes/movimientoStockRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/movimientoStockController');
const {
  validarCrearMovimiento,
  validarActualizarMovimiento,
} = require('../validators/movimientoStockValidator');

router.get('/',       ctrl.listar);
router.get('/:id',    ctrl.obtener);
router.post('/',      validarCrearMovimiento,    ctrl.crear);
router.put('/:id',    validarActualizarMovimiento, ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;