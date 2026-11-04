const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} = require('sequelize');

function seleccionarCampos(body, fields) {
  return Object.fromEntries(
    Object.entries(body).filter(([field]) => fields.includes(field))
  );
}

function responderError(res, error) {
  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }
  if (error instanceof UniqueConstraintError) {
    return res.status(409).json({ error: 'Ya existe un registro con esos datos.' });
  }
  if (error instanceof ForeignKeyConstraintError) {
    return res.status(409).json({
      error: 'La referencia no existe o el registro está relacionado con otros datos.',
    });
  }
  if (error instanceof ValidationError) {
    return res.status(400).json({
      errores: error.errors.map((item) => item.message),
    });
  }

  console.error(error);
  return res.status(500).json({ error: 'Error interno del servidor.' });
}

function crearControladorRecurso({ model, fields, include = [] }) {
  return {
    listar: async (_req, res) => {
      try {
        const registros = await model.findAll({ include, order: [['id', 'ASC']] });
        return res.json(registros);
      } catch (error) {
        return responderError(res, error);
      }
    },

    obtener: async (req, res) => {
      try {
        const registro = await model.findByPk(req.params.id, { include });
        if (!registro) return res.status(404).json({ error: 'Registro no encontrado.' });
        return res.json(registro);
      } catch (error) {
        return responderError(res, error);
      }
    },

    crear: async (req, res) => {
      try {
        const registro = await model.create(seleccionarCampos(req.body, fields));
        return res.status(201).json(registro);
      } catch (error) {
        return responderError(res, error);
      }
    },

    actualizar: async (req, res) => {
      try {
        const registro = await model.findByPk(req.params.id);
        if (!registro) return res.status(404).json({ error: 'Registro no encontrado.' });
        await registro.update(seleccionarCampos(req.body, fields));
        return res.json(registro);
      } catch (error) {
        return responderError(res, error);
      }
    },

    eliminar: async (req, res) => {
      try {
        const registro = await model.findByPk(req.params.id);
        if (!registro) return res.status(404).json({ error: 'Registro no encontrado.' });
        await registro.destroy();
        return res.status(204).send();
      } catch (error) {
        return responderError(res, error);
      }
    },
  };
}

module.exports = { crearControladorRecurso, responderError };
