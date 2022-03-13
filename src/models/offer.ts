import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'
import { ContactInfo, OfferStatus } from '../server-internal-types'
import Group from './group'
import Pallet from './pallet'
import Shipment from './shipment'

export interface OfferAttributes {
  id: number
  status: OfferStatus
  statusChangeTime: Date
  contact?: ContactInfo | null
  shipmentId: number
  sendingGroupId: number
  photoUris: string[]
}

export interface OfferCreationAttributes
  extends Optional<OfferAttributes, 'id'> {}

@Table({
  timestamps: true,
})
export default class Offer extends Model {
  public id!: number

  @Column(DataType.STRING)
  public status!: OfferStatus

  @Column(DataType.JSONB)
  public contact?: ContactInfo

  @Column(DataType.JSONB)
  public photoUris!: string[]

  @ForeignKey(() => Shipment)
  @Column
  public shipmentId!: number

  @BelongsTo(() => Shipment, 'shipmentId')
  public shipment!: Shipment

  @ForeignKey(() => Group)
  @Column
  public sendingGroupId!: number

  @BelongsTo(() => Group, 'sendingGroupId')
  public sendingGroup!: Group

  @Column
  public statusChangeTime!: Date

  @HasMany(() => Pallet)
  public pallets!: Pallet[]

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date
}
