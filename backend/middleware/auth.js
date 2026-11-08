const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const JWT_SECRET = (process.env.JWT_SECRET || '').trim();
const configuredExpiration = process.env.JWT_EXPIRES_IN || '10m';

if (JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres en el archivo .env.');
}

function parseExpiration(value) {
  if (/^\d+$/.test(value)) {
    const seconds = Number(value);
    if (!Number.isSafeInteger(seconds) || seconds < 1) {
      throw new Error('JWT_EXPIRES_IN debe ser una duración positiva válida.');
    }
    return seconds;
  }

  try {
    jwt.sign({ config: true }, JWT_SECRET, {
      expiresIn: value,
      algorithm: 'HS256',
    });
  } catch (error) {
    throw new Error('JWT_EXPIRES_IN debe ser una duración válida, por ejemplo 1h o 3600.', {
      cause: error,
    });
  }
  return value;
}

const JWT_EXPIRES_IN = parseExpiration(configuredExpiration);

function firmarToken(usuario) {
  const payload = { id: usuario.id, email: usuario.email, rol: usuario.rol };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
}

function verificarToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      maxAge: JWT_EXPIRES_IN,
    });
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
      if (!usuario || !usuario.activo) {
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
