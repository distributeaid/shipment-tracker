import { DataTypes, QueryInterface } from 'sequelize'

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.addColumn(
    `UserAccounts`,
    'termsAndConditionsAcceptedAt',
    {
      allowNull: true,
      type: DataTypes.TIME,
    },
  )
}

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.removeColumn(
    `UserAccounts`,
    'termsAndConditionsAcceptedAt',
  )
}
