'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      offerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Offers', key: 'id' },
      },
      palletType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      paymentStatus: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      paymentStatusChangeTime: {
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
    await queryInterface.dropTable('Pallets')
  },
}
