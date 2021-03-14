import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'

import { OfferStatus, ContactInfo } from '../server-internal-types'
import Group from './group'
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

  @ForeignKey(() => Group)
  @Column
  public sendingGroupId!: number

  @BelongsTo(() => Group, 'sendingGroupId')
  public sendingGroup!: Group

  @Column
  public statusChangeTime!: Date

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date
}
