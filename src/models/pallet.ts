import { Optional } from 'sequelize'
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
import {
  Pallet as WirePallet,
  PalletType,
  PaymentStatus,
} from '../server-internal-types'
import LineItem from './line_item'
import Offer from './offer'

export interface PalletAttributes {
  id: number
  offerId: number
  palletType: PalletType
  paymentStatus: PaymentStatus
  paymentStatusChangeTime: Date
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

  @HasMany(() => LineItem)
  public lineItems!: LineItem[]

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date

  public weightKilos() {
    const weightInGrams = this.lineItems
      .map((lineItem) => lineItem.containerWeightGrams || 0)
      .reduce((result, current) => result + current)
    return Math.round(weightInGrams / 1000)
  }

  public toWireFormat(): WirePallet {
    return {
      ...this.get({ plain: true }),
      lineItems: this.lineItems.map((lineItem) => lineItem.toWireFormat()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  public static getWithParentAssociation(id: number): Promise<Pallet | null> {
    return Pallet.findByPk(id, {
      include: {
        model: Offer,
        as: 'offer',
        include: [{ association: 'sendingGroup' }, { association: 'shipment' }],
      },
    })
  }
}
