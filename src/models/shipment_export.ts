import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'
import { ShipmentExport as WireShipmentExport } from '../server-internal-types'
import Shipment from './shipment'
import UserAccount from './user_account'

export interface ShipmentExportAttributes {
  id: number
  googleSheetUrl: string
  shipmentId: number
  userAccountId: number
}

export interface ShipmentExportCreationAttributes
  extends Optional<ShipmentExportAttributes, 'id'> {}

@Table({
  createdAt: true,
})
export default class ShipmentExport extends Model {
  public id!: number

  @Column(DataType.STRING)
  public googleSheetUrl!: string

  @ForeignKey(() => Shipment)
  public shipmentId!: number

  @BelongsTo(() => Shipment, 'shipmentId')
  public shipment!: Shipment

  @ForeignKey(() => UserAccount)
  public userAccountId!: number

  @BelongsTo(() => UserAccount, 'userAccountId')
  public userAccount!: UserAccount

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  public toWireFormat(): WireShipmentExport {
    return {
      id: this.id,
      shipmentId: this.shipmentId,
      googleSheetUrl: this.googleSheetUrl,
      createdBy: {
        id: this.userAccountId,
        isAdmin: true,
      },
      createdAt: this.createdAt,
    }
  }
}
