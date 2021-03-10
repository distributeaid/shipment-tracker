'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Offers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      contact: {
        type: Sequelize.JSONB,
      },
      photoUris: {
        allowNull: false,
        type: Sequelize.JSONB,
      },
      shipmentId: {
        type: Sequelize.INTEGER,
        references: { model: 'Shipments', key: 'id' },
      },
      sendingGroupId: {
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
    await queryInterface.dropTable('Offers')
  },
}
