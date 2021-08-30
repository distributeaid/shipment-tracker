import { DataTypes, QueryInterface, Sequelize } from 'sequelize'
import Group from '../../src/models/group'
import UserAccount from '../../src/models/user_account'
import { GroupType } from '../../src/server-internal-types'

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable(`${UserAccount.name}s`, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  await queryInterface.createTable(`${Group.name}s`, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    captainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: `${UserAccount.name}s`,
        key: 'id',
      },
    },
    groupType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [GroupType.DaHub, GroupType.ReceivingGroup, GroupType.SendingGroup],
        ],
      },
    },
    primaryLocation: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    primaryContact: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
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
