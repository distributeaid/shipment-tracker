'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // TODO: make this a transaction
    await Promise.all([
      queryInterface.addColumn('Groups', 'primaryLocation',
        {
          allowNull: false,
          type: Sequelize.JSON,
        }
      ),
      queryInterface.addColumn('Groups', 'website', { type: Sequelize.STRING }),
      queryInterface.addColumn('Groups', 'primaryContact',
        {
          allowNull: false,
          type: Sequelize.JSON,
        }
      ),
      queryInterface.changeColumn('Groups', 'name',
        { allowNull: false, type: Sequelize.STRING }
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('Groups', 'primaryLocation'),
      queryInterface.removeColumn('Groups', 'primaryContact'),
      queryInterface.removeColumn('Groups', 'website'),
      queryInterface.changeColumn('Groups', 'name',
        { allowNull: true, type: Sequelize.STRING  }
      )
    ])
  }
};
