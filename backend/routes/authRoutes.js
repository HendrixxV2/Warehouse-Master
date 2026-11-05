const express = require('express');
const ctrl = require('../controllers/authController');
const { autenticar } = require('../middleware/auth');
const {
  validarRegistro,
  validarLogin,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/register', validarRegistro, ctrl.registro);
router.post('/registro', validarRegistro, ctrl.registro);
router.post('/login', validarLogin, ctrl.login);
router.get('/me', autenticar, ctrl.me);

module.exports = router;