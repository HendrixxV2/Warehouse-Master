const { Usuario } = require('../models');
const { firmarToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

module.exports = {
  async registro(req, res) {
    try {
      const { nombre, email, password, rol } = req.body;

      const existe = await Usuario.findOne({ where: { email } });
      if (existe) {
        return res.status(409).json({ errores: ['El correo electrónico ya está registrado.'] });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const usuario = await Usuario.create({
        nombre,
        email,
        password: passwordHash,
        rol: rol || 'operador',
      });

      const token = firmarToken(usuario);
      return res.status(201).json({
        mensaje: 'Usuario registrado correctamente.',
        usuario: usuario.toJSON(),
        token,
      });
    } catch (err) {
      return res.status(500).json({ errores: ['Error al registrar el usuario.'] });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ errores: ['Correo o contraseña incorrectos.'] });
      }

      const valido = await usuario.validarPassword(password);
      if (!valido) {
        return res.status(401).json({ errores: ['Correo o contraseña incorrectos.'] });
      }

      const token = firmarToken(usuario);
      return res.json({
        mensaje: 'Inicio de sesión exitoso.',
        usuario: usuario.toJSON(),
        token,
      });
    } catch (err) {
      return res.status(500).json({ errores: ['Error al iniciar sesión.'] });
    }
  },

  async me(req, res) {
    return res.json({ usuario: req.usuario });
  },
};