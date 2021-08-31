import { DataTypes, QueryInterface, Sequelize } from 'sequelize'
import PasswordResetToken from '../../src/models/password_reset_token'

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(`${PasswordResetToken.name}s`, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 6],
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP') as unknown as string,
    },
  })
}
export const down = () => {}
