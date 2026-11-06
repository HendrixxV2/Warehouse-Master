'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable('pedidos');

    if (!columns.id_cliente) {
      await queryInterface.addColumn('pedidos', 'id_cliente', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'clientes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  },

  async down(queryInterface) {
    const columns = await queryInterface.describeTable('pedidos');

    if (columns.id_cliente) {
      await queryInterface.removeColumn('pedidos', 'id_cliente');
    }
  },
};
