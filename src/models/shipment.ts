import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'
import {
  ShipmentPricing,
  ShipmentStatus,
  ShippingRoute,
} from '../server-internal-types'
import Group from './group'

export interface ShipmentAttributes {
  id: number
  shippingRoute: ShippingRoute
  labelYear: number
  labelMonth: number
  offerSubmissionDeadline?: Date | null
  status: ShipmentStatus
  sendingHubId: number
  receivingHubId: number
  statusChangeTime: Date
  pricing: ShipmentPricing
}

export interface ShipmentCreationAttributes
  extends Optional<ShipmentAttributes, 'id' | 'statusChangeTime' | 'pricing'> {}

@Table({
  timestamps: true,
})
export default class Shipment extends Model<
  ShipmentAttributes,
  ShipmentCreationAttributes
> {
  public id!: number

  @Column(DataType.STRING)
  public shippingRoute!: ShippingRoute

  @Column
  public labelYear!: number

  @Column
  public labelMonth!: number

  @Column
  public offerSubmissionDeadline?: Date

  @Column(DataType.STRING)
  public status!: ShipmentStatus

  @ForeignKey(() => Group)
  @Column
  public sendingHubId!: number

  @BelongsTo(() => Group, 'sendingHubId')
  public sendingHub!: Group

  @ForeignKey(() => Group)
  @Column
  public receivingHubId!: number

  @BelongsTo(() => Group, 'receivingHubId')
  public receivingHub!: Group

  @Column
  public statusChangeTime!: Date

  @Column(DataType.JSONB)
  public pricing!: ShipmentPricing

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date
}
