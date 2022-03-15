'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sendingHubs = await queryInterface.sequelize.query(
      'SELECT id FROM "Groups" WHERE "Groups"."groupType" = ? LIMIT 1',
      {
        replacements: ['REGULAR'],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    )

    const receivingHubId = await queryInterface.sequelize.query(
      'SELECT id FROM "Groups" WHERE "Groups"."groupType" = ? LIMIT 1',
      {
        replacements: ['REGULAR'],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    )

    await queryInterface.bulkInsert('Shipments', [
      {
        shipmentRoute: 'UK',
        labelYear: 2021,
        labelMonth: 3,
        offerSubmissionDeadline: new Date(),
        status: 'ANNOUNCED',
        sendingHubs: sendingHubs[0].id,
        receivingHubId: receivingHubId[0].id,
        statusChangeTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Shipments', null, {})
  },
}
