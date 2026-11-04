const express = require('express');
const ctrl = require('../controllers/categoriaController');
const { validarId } = require('../validators/common');
const {
  validarCrearCategoria,
  validarActualizarCategoria,
} = require('../validators/categoriaValidator');

const router = express.Router();
router.param('id', validarId);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', validarCrearCategoria, ctrl.crear);
router.put('/:id', validarActualizarCategoria, ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
