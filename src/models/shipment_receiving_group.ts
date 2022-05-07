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
export default class ShipmentReceivingGroup extends Model {
  @ForeignKey(() => Group)
  @Column
  public groupId!: number

  @BelongsTo(() => Group, 'groupId')
  public group!: Group

  @ForeignKey(() => Shipment)
  @Column
  public shipmentId!: number

  @BelongsTo(() => Shipment, 'shipmentId')
  public shipment!: Shipment
}
