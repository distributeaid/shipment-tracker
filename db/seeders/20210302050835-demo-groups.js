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
          updatedAt: new Date(),
          primaryLocation: JSON.stringify({
            countryCode: 'FR',
            townCity: 'Calais',
          }),
          primaryContact: JSON.stringify({
            name: 'Myriam McLaughlin',
          }),
        },
        {
          name: 'Brighton',
          groupType: 'SENDING_GROUP',
          createdAt: new Date(),
          updatedAt: new Date(),
          primaryLocation: JSON.stringify({
            countryCode: 'FR',
            townCity: 'Dunkerque',
          }),
          primaryContact: JSON.stringify({
            name: 'Meaghan Crist',
          }),
        },
        {
          name: 'Calais',
          groupType: 'RECEIVING_GROUP',
          createdAt: new Date(),
          updatedAt: new Date(),
          primaryLocation: JSON.stringify({
            countryCode: 'GB',
            townCity: 'London',
          }),
          primaryContact: JSON.stringify({
            name: 'Jacinthe Donnelly',
          }),
        },
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Groups', null, {})
  },
}
