'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('UserAccounts', 'googleAuthState', {
      type: Sequelize.DataTypes.JSONB,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserAccounts', 'googleAuthState')
  },
}
