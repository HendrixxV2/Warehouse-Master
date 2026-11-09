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

async function login(req, res, rolEsperado) {
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

    const rolCorrecto = rolEsperado === 'admin'
      ? usuario.rol === 'admin'
      : ['supervisor', 'operador'].includes(usuario.rol);
    if (!rolCorrecto) {
      return res.status(403).json({
        error: rolEsperado === 'admin'
          ? 'Este acceso es exclusivo para administradores.'
          : 'Las cuentas administradoras deben usar el acceso de administración.',
      });
    }

    const token = firmarToken(usuario);
    return res.json({
      token,
      usuario: serializarUsuario(usuario),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
}

module.exports = {
  async registro(req, res) {
    try {
      const { nombre, email, password } = req.body;

      const existe = await Usuario.findOne({ where: { email } });
      if (existe) {
        return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const usuario = await Usuario.create({
        nombre,
        email,
        password: passwordHash,
        rol: 'operador',
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

  loginUsuario(req, res) {
    return login(req, res, 'usuario');
  },

  loginAdmin(req, res) {
    return login(req, res, 'admin');
  },

  async me(req, res) {
    return res.json(serializarUsuario(req.user || req.usuario));
  },
};