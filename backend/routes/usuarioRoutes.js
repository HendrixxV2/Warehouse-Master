const express = require('express');
const ctrl = require('../controllers/usuarioController');
const { validarId } = require('../validators/common');
const {
  validarCrearUsuario,
  validarActualizarUsuario,
} = require('../validators/usuarioValidator');

const router = express.Router();
router.param('id', validarId);
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', validarCrearUsuario, ctrl.crear);
router.put('/:id', validarActualizarUsuario, ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;
