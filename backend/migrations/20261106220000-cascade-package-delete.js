'use strict';

const constraintName = 'paquetes_id_pedido_pedidos_fk';

async function replacePedidoConstraint(queryInterface, onDelete) {
  const [constraints] = await queryInterface.sequelize.query(`
    SELECT CONSTRAINT_NAME AS constraintName
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'paquetes'
      AND COLUMN_NAME = 'id_pedido'
      AND REFERENCED_TABLE_NAME = 'pedidos'
  `);

  for (const constraint of constraints) {
    await queryInterface.removeConstraint('paquetes', constraint.constraintName);
  }

  await queryInterface.addConstraint('paquetes', {
    fields: ['id_pedido'],
    type: 'foreign key',
    name: constraintName,
    references: { table: 'pedidos', field: 'id' },
    onUpdate: 'CASCADE',
    onDelete,
  });
}

module.exports = {
  async up(queryInterface) {
    await replacePedidoConstraint(queryInterface, 'CASCADE');
  },

  async down(queryInterface) {
    await replacePedidoConstraint(queryInterface, 'RESTRICT');
  },
};
