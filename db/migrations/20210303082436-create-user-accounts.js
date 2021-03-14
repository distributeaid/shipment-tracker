'use strict'

const { createInterface } = require('readline')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserAccounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      auth0Id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })

    await queryInterface.addIndex('UserAccounts', ['auth0Id'], { unique: true })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserAccounts')
  },
}
