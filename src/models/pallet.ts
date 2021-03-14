import { Optional } from 'sequelize'
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
import { PalletType, PaymentStatus } from '../server-internal-types'
import Offer from './offer'

export interface PalletAttributes {
  id: number
  offerId: number
  palletType: PalletType
  paymentStatus: PaymentStatus
}

export interface PalletCreationAttributes
  extends Optional<PalletAttributes, 'id'> {}

@Table({
  timestamps: true,
})
export default class Pallet extends Model<
  PalletAttributes,
  PalletCreationAttributes
> {
  public id!: number

  @Column(DataType.STRING)
  public palletType!: PalletType

  @Column(DataType.STRING)
  public paymentStatus!: PaymentStatus

  @ForeignKey(() => Offer)
  @Column
  public offerId!: number

  @BelongsTo(() => Offer, 'offerId')
  public offer!: Offer

  @Column
  public paymentStatusChangeTime!: Date

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date
}
