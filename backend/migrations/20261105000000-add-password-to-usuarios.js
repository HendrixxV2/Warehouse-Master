'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'password', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: '',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'password');
  },
};