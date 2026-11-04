const TIPOS_VALIDOS = ['entrada', 'salida'];
const esEnteroPositivo = (v) => Number.isInteger(v) && v > 0;

function validarCrearMovimiento(req, res, next) {
  const errores = [];
  const { tipo, cantidad, id_usuario, id_producto, fecha } = req.body;

  if (!tipo) errores.push('El campo "tipo" es obligatorio.');
  else if (!TIPOS_VALIDOS.includes(tipo))
    errores.push(`"tipo" debe ser uno de: ${TIPOS_VALIDOS.join(', ')}.`);

  if (cantidad === undefined) errores.push('El campo "cantidad" es obligatorio.');
  else if (!esEnteroPositivo(cantidad))
    errores.push('"cantidad" debe ser un entero positivo.');

  if (!id_usuario) errores.push('"id_usuario" es obligatorio.');
  else if (!esEnteroPositivo(id_usuario))
    errores.push('"id_usuario" debe ser un entero positivo.');

  if (!id_producto) errores.push('"id_producto" es obligatorio.');
  else if (!esEnteroPositivo(id_producto))
    errores.push('"id_producto" debe ser un entero positivo.');

  if (fecha && isNaN(Date.parse(fecha)))
    errores.push('"fecha" debe ser una fecha válida (ISO 8601).');

  if (errores.length) return res.status(400).json({ errores });
  next();
}

function validarActualizarMovimiento(req, res, next) {
  const errores = [];
  const { tipo, cantidad, fecha } = req.body;

  if (tipo !== undefined && !TIPOS_VALIDOS.includes(tipo))
    errores.push(`"tipo" debe ser uno de: ${TIPOS_VALIDOS.join(', ')}.`);
  if (cantidad !== undefined && !esEnteroPositivo(cantidad))
    errores.push('"cantidad" debe ser un entero positivo.');
  if (fecha !== undefined && isNaN(Date.parse(fecha)))
    errores.push('"fecha" debe ser una fecha válida.');

  if (errores.length) return res.status(400).json({ errores });
  next();
}

module.exports = { validarCrearMovimiento, validarActualizarMovimiento };