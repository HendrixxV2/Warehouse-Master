const express = require('express');
const ctrl = require('../controllers/almacenController');
const { validarId } = require('../validators/common');
const {
  validarCrearAlmacen,
  validarActualizarAlmacen,
} = require('../validators/almacenValidator');

const router = express.Router();
router.param('id', validarId);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', validarCrearAlmacen, ctrl.crear);
router.put('/:id', validarActualizarAlmacen, ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
