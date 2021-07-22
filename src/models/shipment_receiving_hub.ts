import { Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import Group from './group'
import Shipment from './shipment'

@Table({
  timestamps: true,
})
export default class ShipmentReceivingHub extends Model {
  @ForeignKey(() => Group)
  @Column
  public hubId!: number

  @ForeignKey(() => Shipment)
  @Column
  public shipmentId!: number
}
