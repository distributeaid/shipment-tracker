import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import Group from './group'
import Shipment from './shipment'

@Table({
  timestamps: true,
})
export default class ShipmentReceivingHub extends Model {
  @ForeignKey(() => Group)
  @Column
  public hubId!: number

  @BelongsTo(() => Group, 'hubId')
  public hub!: Group

  @ForeignKey(() => Shipment)
  @Column
  public shipmentId!: number

  @BelongsTo(() => Shipment, 'shipmentId')
  public shipment!: Shipment
}
