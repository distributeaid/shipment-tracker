'use strict'

const { captureRejectionSymbol } = require('ws')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('UserAccounts', [
      {
        username: 'seeded-account-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    const [{ id: captainId }] = await queryInterface.sequelize.query(
      'SELECT id FROM "UserAccounts" LIMIT 1',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    )

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
          captainId,
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
          captainId,
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
          captainId,
        },
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Groups', null, {})
  },
}
