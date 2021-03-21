'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ShipmentExports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      googleSheetUrl: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      shipmentId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Shipments', key: 'id' },
      },
      userAccountId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'UserAccounts', key: 'id' },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })

    await queryInterface.addIndex('ShipmentExports', ['shipmentId'], {
      unique: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('ShipmentExports', 'shipmentId')
    await queryInterface.dropTable('ShipmentExports')
  },
}
