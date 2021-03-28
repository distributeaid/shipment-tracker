'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Shipments', 'pricing', {
      type: Sequelize.DataTypes.JSONB,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Shipments', 'pricing')
  },
}
