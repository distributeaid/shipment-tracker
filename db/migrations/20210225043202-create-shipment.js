'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Shipments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      shippingRoute: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      labelYear: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      labelMonth: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      offerSubmissionDeadline: {
        type: Sequelize.DATE,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sendingHubId: {
        type: Sequelize.INTEGER,
        references: { model: 'Groups', key: 'id' },
      },
      receivingHubId: {
        type: Sequelize.INTEGER,
        references: { model: 'Groups', key: 'id' },
      },
      statusChangeTime: {
        allowNull: false,
        type: Sequelize.DATE,
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Shipments')
  },
}
