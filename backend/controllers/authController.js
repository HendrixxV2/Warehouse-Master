const { Usuario } = require('../models');
const { firmarToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const serializarUsuario = (usuario) => ({
  id: usuario.id,
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol,
});

module.exports = {
  async registro(req, res) {
    try {
      const { nombre, email, password, rol } = req.body;

      const existe = await Usuario.findOne({ where: { email } });
      if (existe) {
        return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const usuario = await Usuario.create({
        nombre,
        email,
        password: passwordHash,
        rol: rol || 'operador',
      });

      const usuarioPublico = serializarUsuario(usuario);
      const token = firmarToken(usuario);

      return res.status(201).json({
        ...usuarioPublico,
        token,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error al registrar el usuario.' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario || !usuario.activo) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
      }

      const valido = await usuario.validarPassword(password);
      if (!valido) {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
      }

      const token = firmarToken(usuario);
      return res.json({
        token,
        usuario: serializarUsuario(usuario),
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error al iniciar sesión.' });
    }
  },

  async me(req, res) {
    return res.json(serializarUsuario(req.user || req.usuario));
  },
};