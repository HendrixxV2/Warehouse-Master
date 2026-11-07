const {
  Pedido,
  Usuario,
  DetallePedido,
  Producto,
  Paquete,
  sequelize,
} = require('../models');
const {
  crearControladorRecurso,
  responderError,
} = require('./resourceController');

const controlador = crearControladorRecurso({
  model: Pedido,
  fields: ['fecha', 'estado', 'id_usuario'],
  include: [
    { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email', 'rol'] },
    {
      model: DetallePedido,
      as: 'detalles',
      include: [{ model: Producto, as: 'producto' }],
    },
  ],
});

controlador.eliminar = async (req, res) => {
  try {
    await sequelize.transaction(async (transaction) => {
      const pedido = await Pedido.findByPk(req.params.id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!pedido) {
        const error = new Error('Registro no encontrado.');
        error.status = 404;
        throw error;
      }

      await DetallePedido.destroy({
        where: { id_pedido: pedido.id },
        transaction,
      });
      await Paquete.destroy({
        where: { id_pedido: pedido.id },
        transaction,
      });
      await pedido.destroy({ transaction });
    });
    return res.status(204).send();
  } catch (error) {
    return responderError(res, error);
  }
};

module.exports = controlador;
