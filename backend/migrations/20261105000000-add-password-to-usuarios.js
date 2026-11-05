'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable('usuarios');

    if (!columns.password) {
      if (columns.contraseña) {
        await queryInterface.renameColumn('usuarios', 'contraseña', 'password');
      } else {
        await queryInterface.addColumn('usuarios', 'password', {
          type: Sequelize.STRING(255),
          allowNull: false,
          defaultValue: '',
        });
      }
    }
  },

  async down(queryInterface) {
    const columns = await queryInterface.describeTable('usuarios');

    if (columns.password && !columns.contraseña) {
      await queryInterface.renameColumn('usuarios', 'password', 'contraseña');
    } else if (columns.password) {
      await queryInterface.removeColumn('usuarios', 'password');
    }
  },
};