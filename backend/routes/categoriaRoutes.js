const express = require('express');
const ctrl = require('../controllers/categoriaController');
const { validarId } = require('../validators/common');
const {
  validarCrearCategoria,
  validarActualizarCategoria,
} = require('../validators/categoriaValidator');
const { autorizar } = require('../middleware/auth');

const router = express.Router();
router.param('id', validarId);
router.get('/', autorizar('admin', 'supervisor'), ctrl.listar);
router.get('/:id', autorizar('admin', 'supervisor'), ctrl.obtener);
router.post('/', autorizar('admin'), validarCrearCategoria, ctrl.crear);
router.put('/:id', autorizar('admin'), validarActualizarCategoria, ctrl.actualizar);
router.delete('/:id', autorizar('admin'), ctrl.eliminar);

module.exports = router;
