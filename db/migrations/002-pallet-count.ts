import { DataTypes, QueryInterface } from 'sequelize'

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.addColumn(`Pallets`, 'palletCount', {
    allowNull: false,
    type: DataTypes.INTEGER,
  })
}
export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.removeColumn(`Pallets`, 'palletCount')
}
