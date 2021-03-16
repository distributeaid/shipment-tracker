'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('LineItems', 'boxCount', 'containerCount')
    await queryInterface.renameColumn(
      'LineItems',
      'boxWeightGrams',
      'containerWeightGrams',
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('LineItems', 'containerCount', 'boxCount')
    await queryInterface.renameColumn(
      'LineItems',
      'containerWeightGrams',
      'boxWeightGrams',
    )
  },
}
