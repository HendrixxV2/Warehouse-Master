'use strict';

const bcrypt = require('bcryptjs');
const { sequelize, Categoria, Proveedor, Almacen, Usuario } = require('../models');

const CONTRASENIA_DEMO = 'WarehouseDemo123';

module.exports = {
  async up() {
    await sequelize.transaction(async (transaction) => {
      const [categoria] = await Categoria.findOrCreate({
        where: { nombre: 'General' },
        defaults: { descripcion: 'Categoría inicial de productos' },
        transaction,
      });
      const [proveedor] = await Proveedor.findOrCreate({
        where: { email: 'proveedor.demo@warehouse.local' },
        defaults: {
          nombre: 'Proveedor de demostración',
          telefono: null,
          direccion: null,
        },
        transaction,
      });
      const [almacen] = await Almacen.findOrCreate({
        where: { nombre: 'Almacén principal' },
        defaults: { ubicacion: 'Por definir', capacidad: null },
        transaction,
      });
      const [usuario] = await Usuario.findOrCreate({
        where: { email: 'operador.demo@warehouse.local' },
        defaults: { nombre: 'Operador de demostración', rol: 'operador' },
        transaction,
      });
      // Si el usuario ya existía (sin contraseña) o es nuevo, se asigna una
      // contraseña de demostración para que el sistema se pueda probar.
      if (!usuario.password) {
        usuario.password = await bcrypt.hash(CONTRASENIA_DEMO, 10);
        await usuario.save({ transaction });
      }

      await sequelize.models.Producto.findOrCreate({
        where: { nombre: 'Producto de demostración' },
        defaults: {
          precio: 0,
          stock_actual: 0,
          id_categoria: categoria.id,
          id_proveedor: proveedor.id,
          id_almacen: almacen.id,
        },
        transaction,
      });
    });
  },

  async down() {
    await sequelize.transaction(async (transaction) => {
      await sequelize.models.Producto.destroy({
        where: { nombre: 'Producto de demostración' },
        transaction,
      });
      await Usuario.destroy({
        where: { email: 'operador.demo@warehouse.local' },
        transaction,
      });
      await Proveedor.destroy({
        where: { email: 'proveedor.demo@warehouse.local' },
        transaction,
      });
      await Almacen.destroy({
        where: { nombre: 'Almacén principal' },
        transaction,
      });
      await Categoria.destroy({
        where: { nombre: 'General' },
        transaction,
      });
    });
  },
};
