'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('Groups', 'primaryLocation', {
          allowNull: false,
          type: Sequelize.JSONB,
        }),
        queryInterface.addColumn('Groups', 'website', {
          type: Sequelize.STRING,
        }),
        queryInterface.addColumn('Groups', 'primaryContact', {
          allowNull: false,
          type: Sequelize.JSONB,
        }),
        queryInterface.changeColumn('Groups', 'name', {
          allowNull: false,
          type: Sequelize.STRING,
        }),
      ])
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Groups', 'primaryLocation'),
        queryInterface.removeColumn('Groups', 'primaryContact'),
        queryInterface.removeColumn('Groups', 'website'),
        queryInterface.changeColumn('Groups', 'name', {
          allowNull: true,
          type: Sequelize.STRING,
        }),
      ])
    })
  },
}
