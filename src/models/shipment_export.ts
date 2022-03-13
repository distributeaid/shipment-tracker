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
import Shipment from './shipment'
import UserAccount from './user_account'

export interface ShipmentExportAttributes {
  id: number
  shipmentId: number
  userAccountId: number
  contentsCsv: string
}

export interface ShipmentExportCreationAttributes
  extends Optional<ShipmentExportAttributes, 'id'> {}

@Table({
  createdAt: true,
  updatedAt: false,
})
export default class ShipmentExport extends Model {
  public id!: number

  @Column(DataType.TEXT)
  public contentsCsv!: string

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
}
