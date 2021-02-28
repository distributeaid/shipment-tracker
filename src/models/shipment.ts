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

import { ShipmentStatus, ShippingRoute } from '../server-internal-types'
import Group from './group'

@Table({
  timestamps: true,
})
export default class Shipment extends Model {
  @Column(DataType.STRING)
  public shippingRoute: ShippingRoute

  @Column
  public labelYear: number

  @Column
  public labelMonth: number

  @Column
  public offerSubmissionDeadline: Date

  @Column(DataType.STRING)
  public status: ShipmentStatus

  @ForeignKey(() => Group)
  @Column
  public sendingHubId: number

  @BelongsTo(() => Group, 'sendingHubId')
  public sendingHub: Group

  @ForeignKey(() => Group)
  @Column
  public receivingHubId: number

  @BelongsTo(() => Group, 'receivingHubId')
  public receivingHub: Group

  @Column
  public statusChangeTime: Date

  @CreatedAt
  @Column
  public createdAt: Date

  @UpdatedAt
  @Column
  public updatedAt: Date
}
