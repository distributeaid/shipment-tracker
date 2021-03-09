'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Groups', 'captainId', {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: { model: 'UserAccounts', key: 'id' },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Groups', 'captainId')
  },
}
