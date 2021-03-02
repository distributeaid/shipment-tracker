'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.addColumn(
      'Groups', // Table name
      'groupType', // Field name
      {
        type: Sequelize.DataTypes.STRING,
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.removeColumn('Groups', 'groupType')
  },
}
