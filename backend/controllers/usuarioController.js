const { Usuario } = require('../models');
const { crearControladorRecurso, responderError } = require('./resourceController');

const campos = ['nombre', 'email', 'rol'];
const controlador = crearControladorRecurso({
  model: Usuario,
  fields: campos,
});

controlador.listar = async (_req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      where: { activo: true },
      order: [['id', 'ASC']],
    });
    return res.json(usuarios);
  } catch (error) {
    return responderError(res, error);
  }
};

controlador.obtener = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      where: { id: req.params.id, activo: true },
    });
    if (!usuario) return res.status(404).json({ error: 'Registro no encontrado.' });
    return res.json(usuario);
  } catch (error) {
    return responderError(res, error);
  }
};

controlador.actualizar = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      where: { id: req.params.id, activo: true },
    });
    if (!usuario) return res.status(404).json({ error: 'Registro no encontrado.' });

    const cambios = Object.fromEntries(
      Object.entries(req.body).filter(([field]) => campos.includes(field))
    );
    await usuario.update(cambios);
    return res.json(usuario);
  } catch (error) {
    return responderError(res, error);
  }
};

controlador.eliminar = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      where: { id: req.params.id, activo: true },
    });
    if (!usuario) return res.status(404).json({ error: 'Registro no encontrado.' });

    await usuario.update({ activo: false });
    return res.status(204).send();
  } catch (error) {
    return responderError(res, error);
  }
};

module.exports = controlador;
