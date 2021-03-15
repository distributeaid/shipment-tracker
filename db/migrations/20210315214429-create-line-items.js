'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LineItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      offerPalletId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Pallets', key: 'id' },
      },
      proposedReceivingGroupId: {
        type: Sequelize.INTEGER,
        references: { model: 'Groups', key: 'id' },
      },
      acceptedReceivingGroupId: {
        type: Sequelize.INTEGER,
        references: { model: 'Groups', key: 'id' },
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      containerType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      itemCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      boxCount: {
        type: Sequelize.INTEGER,
      },
      boxWeightGrams: {
        type: Sequelize.INTEGER,
      },
      containerLengthCm: {
        type: Sequelize.INTEGER,
      },
      containerWidthCm: {
        type: Sequelize.INTEGER,
      },
      containerHeightCm: {
        type: Sequelize.INTEGER,
      },
      affirmLiability: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      tosAccepted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      dangerousGoods: {
        allowNull: false,
        type: Sequelize.JSONB,
      },
      photoUris: {
        allowNull: false,
        type: Sequelize.JSONB,
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

    await queryInterface.addIndex('LineItems', ['offerPalletId'], {
      unique: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LineItems')
  },
}
