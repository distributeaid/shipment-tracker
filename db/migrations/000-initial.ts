import { DataTypes, QueryInterface, Sequelize } from 'sequelize'
import {
  DangerousGoods,
  GroupType,
  LineItemCategory,
  LineItemContainerType,
  LineItemStatus,
  OfferStatus,
  PalletType,
  PaymentStatus,
  ShipmentStatus,
} from '../../src/server-internal-types'

const id = {
  type: DataTypes.INTEGER,
  primaryKey: true,
  allowNull: false,
  autoIncrement: true,
}
const createdAt = {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
}
const updatedAt = {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  onUpdate: Sequelize.literal('CURRENT_TIMESTAMP') as unknown as string,
}
const autoTimestampFields = {
  createdAt,
  updatedAt,
}

export const up = async (queryInterface: QueryInterface) => {
  // UserAccount
  await queryInterface.createTable(`UserAccounts`, {
    id,
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
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ...autoTimestampFields,
  })
  await queryInterface.addIndex(`UserAccounts`, ['email'], {
    unique: true,
  })
  // VerificationToken
  await queryInterface.createTable(`VerificationTokens`, {
    id,
    userAccountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: `UserAccounts`,
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 6],
      },
    },
    ...autoTimestampFields,
  })
  await queryInterface.addIndex(
    `VerificationTokens`,
    ['userAccountId', 'token'],
    {
      unique: false,
    },
  )
  // Group
  await queryInterface.createTable(`Groups`, {
    id,
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
        model: `UserAccounts`,
        key: 'id',
      },
    },
    groupType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [[GroupType.Regular, GroupType.DaHub]],
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
      validate: {
        isUrl: true,
      },
    },
    ...autoTimestampFields,
  })
  await queryInterface.addIndex(`Groups`, ['captainId'], {
    unique: false,
  })
  // Shipment
  await queryInterface.createTable(`Shipments`, {
    id,
    shippingRoute: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    labelYear: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    labelMonth: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    offerSubmissionDeadline: {
      type: DataTypes.DATE,
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: [
          [
            ShipmentStatus.Draft,
            ShipmentStatus.Announced,
            ShipmentStatus.Open,
            ShipmentStatus.AidMatching,
            ShipmentStatus.Staging,
            ShipmentStatus.InProgress,
            ShipmentStatus.Complete,
            ShipmentStatus.Abandoned,
            ShipmentStatus.Archived,
          ],
        ],
      },
    },
    pricing: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    sendingHubs: {
      type: DataTypes.INTEGER,
      references: { model: `Groups`, key: 'id' },
      allowNull: false,
    },
    receivingHubId: {
      type: DataTypes.INTEGER,
      references: { model: `Groups`, key: 'id' },
      allowNull: false,
    },
    statusChangeTime: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    ...autoTimestampFields,
  })
  // ShipmentReceivingHub
  await queryInterface.createTable(`ShipmentReceivingHubs`, {
    id,
    shipmentId: {
      type: DataTypes.INTEGER,
      references: { model: `Shipments`, key: 'id' },
      allowNull: false,
    },
    hubId: {
      type: DataTypes.INTEGER,
      references: { model: `Groups`, key: 'id' },
      allowNull: false,
    },
    ...autoTimestampFields,
  })
  await queryInterface.addIndex(`ShipmentReceivingHubs`, ['shipmentId'], {
    unique: false,
  })
  await queryInterface.addIndex(`ShipmentReceivingHubs`, ['hubId'], {
    unique: false,
  })
  // ShipmentSendingHub
  await queryInterface.createTable(`ShipmentSendingHubs`, {
    id,
    shipmentId: {
      type: DataTypes.INTEGER,
      references: { model: `Shipments`, key: 'id' },
      allowNull: false,
    },
    hubId: {
      type: DataTypes.INTEGER,
      references: { model: `Groups`, key: 'id' },
      allowNull: false,
    },
    ...autoTimestampFields,
  })
  await queryInterface.addIndex(`ShipmentSendingHubs`, ['shipmentId'], {
    unique: false,
  })
  await queryInterface.addIndex(`ShipmentSendingHubs`, ['hubId'], {
    unique: false,
  })
  // Offer
  await queryInterface.createTable(`Offers`, {
    id,
    status: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: [
          [
            OfferStatus.Draft,
            OfferStatus.Proposed,
            OfferStatus.BeingReviewed,
            OfferStatus.Rejected,
            OfferStatus.Accepted,
          ],
        ],
      },
    },
    contact: {
      type: DataTypes.JSONB,
    },
    photoUris: {
      allowNull: false,
      type: DataTypes.JSONB,
    },
    shipmentId: {
      type: DataTypes.INTEGER,
      references: { model: `Shipments`, key: 'id' },
      allowNull: false,
    },
    sendingGroupId: {
      type: DataTypes.INTEGER,
      references: { model: `Groups`, key: 'id' },
      allowNull: false,
    },
    statusChangeTime: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    ...autoTimestampFields,
  })
  await queryInterface.addIndex(`Offers`, ['shipmentId'], {
    unique: false,
  })
  // Pallets
  await queryInterface.createTable(`Pallets`, {
    id,
    offerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: `Offers`, key: 'id' },
    },
    palletType: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: [[PalletType.Standard, PalletType.Euro, PalletType.Custom]],
      },
    },
    paymentStatus: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: [
          [
            PaymentStatus.WontPay,
            PaymentStatus.Uninitiated,
            PaymentStatus.Invoiced,
            PaymentStatus.Paid,
          ],
        ],
      },
    },
    paymentStatusChangeTime: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    ...autoTimestampFields,
  })
  await queryInterface.addIndex(`Pallets`, ['offerId'], {
    unique: false,
  })
  // LineItems
  await queryInterface.createTable('LineItems', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    offerPalletId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: `Pallets`, key: 'id' },
    },
    proposedReceivingGroupId: {
      type: DataTypes.INTEGER,
      references: { model: `Groups`, key: 'id' },
    },
    acceptedReceivingGroupId: {
      type: DataTypes.INTEGER,
      references: { model: `Groups`, key: 'id' },
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: [
          [
            LineItemStatus.Proposed,
            LineItemStatus.AwaitingApproval,
            LineItemStatus.Accepted,
            LineItemStatus.NotAccepted,
          ],
        ],
      },
    },
    containerType: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: [
          [
            LineItemContainerType.Unset,
            LineItemContainerType.BulkBag,
            LineItemContainerType.Box,
            LineItemContainerType.FullPallet,
          ],
        ],
      },
    },
    category: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: [
          [
            LineItemCategory.Unset,
            LineItemCategory.Clothing,
            LineItemCategory.Shelter,
            LineItemCategory.Hygiene,
            LineItemCategory.Food,
            LineItemCategory.Games,
            LineItemCategory.Electronics,
            LineItemCategory.Medical,
            LineItemCategory.Ppe,
            LineItemCategory.Other,
          ],
        ],
      },
    },
    description: {
      type: DataTypes.STRING,
    },
    itemCount: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    containerCount: {
      type: DataTypes.INTEGER,
    },
    containerWeightGrams: {
      type: DataTypes.INTEGER,
    },
    containerLengthCm: {
      type: DataTypes.INTEGER,
    },
    containerWidthCm: {
      type: DataTypes.INTEGER,
    },
    containerHeightCm: {
      type: DataTypes.INTEGER,
    },
    affirmLiability: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    tosAccepted: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    dangerousGoods: {
      allowNull: false,
      type: DataTypes.JSONB,
      validate: {
        isIn: [
          [
            DangerousGoods.Flammable,
            DangerousGoods.Explosive,
            DangerousGoods.Medicine,
            DangerousGoods.Batteries,
            DangerousGoods.Liquids,
            DangerousGoods.Other,
          ],
        ],
      },
    },
    photoUris: {
      allowNull: false,
      type: DataTypes.JSONB,
    },
    sendingHubDeliveryDate: {
      type: DataTypes.DATE,
    },
    statusChangeTime: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  })

  await queryInterface.addIndex('LineItems', ['offerPalletId'], {
    unique: false,
  })
  // ShipmentExport
  await queryInterface.createTable(`ShipmentExports`, {
    id,
    contentsCsv: {
      type: DataTypes.TEXT,
    },
    shipmentId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: `Shipments`, key: 'id' },
    },
    userAccountId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: `UserAccounts`, key: 'id' },
    },
    createdAt,
  })
  await queryInterface.addIndex(`ShipmentExports`, ['shipmentId'], {
    unique: false,
  })
}
export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropAllTables()
}
