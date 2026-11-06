const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const JWT_SECRET = (process.env.JWT_SECRET || '').trim();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

if (JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres en el archivo .env.');
}

function firmarToken(usuario) {
  const payload = { id: usuario.id, email: usuario.email, rol: usuario.rol };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verificarToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (typeof authHeader !== 'string' || !authHeader.trim()) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const coincidencia = authHeader.trim().match(/^Bearer\s+(\S+)$/i);
  if (!coincidencia) {
    return res.status(401).json({
      error: 'Formato de autorización inválido. Usa: Bearer <token>.',
    });
  }

  const payload = verificarToken(coincidencia[1]);
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
