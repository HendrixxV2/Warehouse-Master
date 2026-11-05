const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en las variables de entorno (.env).');
}

/** Firma un token JWT con los datos del usuario. */
function firmarToken(usuario) {
  const payload = { id: usuario.id, email: usuario.email, rol: usuario.rol };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/** Verifica y decodifica un token JWT. Devuelve el payload o null. */
function verificarToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/** Middleware: exige un JWT válido en Authorization: Bearer <token>.
 *  Adjunta el usuario autenticado a req.usuario (sin contraseña). */
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ errores: ['Token de acceso no proporcionado.'] });
  }
  const payload = verificarToken(partes[1]);
  if (!payload) {
    return res.status(401).json({ errores: ['Token inválido o expirado.'] });
  }
  Usuario.findByPk(payload.id)
    .then((usuario) => {
      if (!usuario) {
        return res.status(401).json({ errores: ['Usuario no encontrado.'] });
      }
      req.usuario = usuario.toJSON();
      next();
    })
    .catch(() => res.status(500).json({ errores: ['Error al verificar el usuario.'] }));
}

/** Middleware: restringe el acceso a ciertos roles. Debe ir tras autenticar. */
function autorizar(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ errores: ['No tienes permisos para esta acción.'] });
    }
    next();
  };
}

module.exports = { firmarToken, verificarToken, autenticar, autorizar };