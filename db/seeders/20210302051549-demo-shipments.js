'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sendingHubId = await queryInterface.sequelize.query(
      'SELECT id FROM "Groups" WHERE "Groups"."groupType" = ? LIMIT 1',
      {
        replacements: ['SENDING_GROUP'],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    )

    const receivingHubId = await queryInterface.sequelize.query(
      'SELECT id FROM "Groups" WHERE "Groups"."groupType" = ? LIMIT 1',
      {
        replacements: ['RECEIVING_GROUP'],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    )

    await queryInterface.bulkInsert('Shipments', [
      {
        shippingRoute: 'UK',
        labelYear: 2021,
        labelMonth: 3,
        offerSubmissionDeadline: new Date(),
        status: 'ANNOUNCED',
        sendingHubId: sendingHubId[0].id,
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
