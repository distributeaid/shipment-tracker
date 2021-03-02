'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Groups',
      [
        {
          name: 'Stoke-Upon-Trent',
          groupType: 'SENDING_GROUP',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Brighton',
          groupType: 'SENDING_GROUP',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Calais',
          groupType: 'RECEIVING_GROUP',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Groups', null, {})
  },
}
