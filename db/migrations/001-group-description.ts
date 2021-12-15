import { DataTypes, QueryInterface } from 'sequelize'

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.addColumn(`Groups`, 'description', DataTypes.TEXT)
}
export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.removeColumn(`Groups`, 'description')
}
