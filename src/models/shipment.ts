import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'
import { shipmentRoutes } from '../data/shipmentRoutes'
import { ShipmentPricing, ShipmentStatus } from '../server-internal-types'
import Group from './group'
import Offer from './offer'
import ShipmentReceivingHub from './shipment_receiving_hub'
import ShipmentSendingHub from './shipment_sending_hub'

export interface ShipmentAttributes {
  id: number
  shipmentRoute: keyof typeof shipmentRoutes
  labelYear: number
  labelMonth: number
  offerSubmissionDeadline?: Date | null
  status: ShipmentStatus
  sendingHubs: Group[]
  receivingHubs: Group[]
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
  public shipmentRoute!: keyof typeof shipmentRoutes

  @Column
  public labelYear!: number

  @Column
  public labelMonth!: number

  @Column
  public offerSubmissionDeadline?: Date

  @HasMany(() => Offer)
  public offers!: Offer[]

  @Column(DataType.STRING)
  public status!: ShipmentStatus

  @BelongsToMany(() => Group, () => ShipmentSendingHub)
  public sendingHubs!: Group[]

  @BelongsToMany(() => Group, () => ShipmentReceivingHub)
  public receivingHubs!: Group[]

  @Column
  public statusChangeTime!: Date

  @Column(DataType.JSONB)
  public pricing?: ShipmentPricing

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date
}
