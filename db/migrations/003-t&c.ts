import { DataTypes, QueryInterface } from 'sequelize'

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.addColumn(`Groups`, 'termsAndConditionsAcceptedAt', {
    allowNull: false,
    type: DataTypes.DATE,
  })
}
export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.removeColumn(`Groups`, 'termsAndConditionsAcceptedAt')
}
