'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.renameColumn(
      'LineItems',
      'containerWeightGrams', // Old name
      'containerWeightKilos', // New name
    )
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.renameColumn(
      'LineItems',
      'containerWeightKilos',
      'containerWeightGrams',
    )
  },
}
