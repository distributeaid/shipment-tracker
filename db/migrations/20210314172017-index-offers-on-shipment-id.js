'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('Offers', ['shipmentId'], { unique: false })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Offers', 'shipmentId')
  },
}
