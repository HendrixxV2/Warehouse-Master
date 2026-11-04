function crearValidador({ required = [], fields }) {
  return function validar(req, res, next) {
    const body = req.body;
    const errores = [];

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ errores: ['El cuerpo de la solicitud debe ser un objeto JSON.'] });
    }

    for (const key of Object.keys(body)) {
      if (!Object.prototype.hasOwnProperty.call(fields, key)) {
        errores.push(`El campo "${key}" no está permitido.`);
      }
    }

    for (const key of required) {
      if (body[key] === undefined || body[key] === null || body[key] === '') {
        errores.push(`El campo "${key}" es obligatorio.`);
      }
    }

    for (const [key, validate] of Object.entries(fields)) {
      if (body[key] === undefined || body[key] === null) continue;
      if (body[key] === '' && required.includes(key)) continue;
      const error = validate(body[key]);
      if (error) errores.push(error.replace('{field}', key));
    }

    if (required.length === 0 && Object.keys(body).length === 0) {
      errores.push('Debe enviar al menos un campo para actualizar.');
    }

    if (errores.length) return res.status(400).json({ errores });
    return next();
  };
}

function validarId(req, res, next, value) {
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
    return res.status(400).json({ error: 'El identificador debe ser un entero positivo.' });
  }
  return next();
}

const reglas = {
  texto: (max) => (value) => (
    typeof value === 'string' && value.trim().length > 0 && value.length <= max
      ? null
      : `{field} debe ser texto de 1 a ${max} caracteres.`
  ),
  textoOpcional: (max) => (value) => (
    typeof value === 'string' && value.length <= max
      ? null
      : `{field} debe ser texto de hasta ${max} caracteres.`
  ),
  entero: (min = 0) => (value) => (
    Number.isSafeInteger(value) && value >= min
      ? null
      : `{field} debe ser un entero mayor o igual a ${min}.`
  ),
  decimal: (min = 0) => (value) => (
    typeof value === 'number' && Number.isFinite(value) && value >= min
      ? null
      : `{field} debe ser un número mayor o igual a ${min}.`
  ),
  fecha: (value) => (
    typeof value === 'string' && !Number.isNaN(Date.parse(value))
      ? null
      : '{field} debe ser una fecha válida en formato ISO 8601.'
  ),
  email: (value) => (
    typeof value === 'string' &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? null
      : '{field} debe ser un correo electrónico válido.'
  ),
  opcion: (options) => (value) => (
    options.includes(value)
      ? null
      : `{field} debe ser uno de: ${options.join(', ')}.`
  ),
};

module.exports = { crearValidador, validarId, reglas };
