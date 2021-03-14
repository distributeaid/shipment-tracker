'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('Groups', ['captainId'], { unique: false })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Groups', 'captainId')
  },
}
