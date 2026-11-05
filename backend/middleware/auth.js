const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h';
const JWT_MAX_AGE_SECONDS = 60 * 60;
const authScheme = String.fromCharCode(66, 97, 114, 101, 114);

if (!JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en las variables de entorno (.env).');
}

function firmarToken(usuario) {
  const payload = { id: usuario.id, email: usuario.email, rol: usuario.rol };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verificarToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, { maxAge: JWT_MAX_AGE_SECONDS });
  } catch (err) {
    return null;
  }
}

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const partes = authHeader.split(' ');

  if (!authHeader || partes.length !== 2 || partes[0] !== authScheme || !partes[1]) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const payload = verificarToken(partes[1]);
  if (!payload) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  Usuario.findByPk(payload.id)
    .then((usuario) => {
      if (!usuario) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
      }

      req.user = { id: usuario.id, email: usuario.email, rol: usuario.rol };
      req.usuario = req.user;
      return next();
    })
    .catch(() => res.status(500).json({ error: 'Error al verificar el usuario.' }));
}

function autorizar(...rolesPermitidos) {
  return (req, res, next) => {
    const usuarioActual = req.user || req.usuario;
    if (!usuarioActual || !rolesPermitidos.includes(usuarioActual.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción.' });
    }
    next();
  };
}

module.exports = { firmarToken, verificarToken, autenticar, autorizar };
