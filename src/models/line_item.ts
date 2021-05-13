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
import {
  DangerousGoods,
  LineItemCategory,
  LineItemContainerType,
  LineItemStatus,
} from '../server-internal-types'
import Group from './group'
import Pallet from './pallet'

export interface LineItemAttributes {
  id: number
  offerPalletId: number
  proposedReceivingGroupId: number
  acceptedReceivingGroupId: number
  status: LineItemStatus
  containerType: LineItemContainerType
  category: LineItemCategory
  description: string
  itemCount: number
  containerCount?: number
  containerWeightKilos?: number
  containerLengthCm?: number
  containerWidthCm?: number
  containerHeightCm?: number
  affirmLiability: boolean
  tosAccepted: boolean
  dangerousGoods: DangerousGoods[]
  photoUris: string[]
  sendingHubDeliveryDate: Date
  statusChangeTime: Date
}

type CreateAttrKeys =
  | 'offerPalletId'
  | 'status'
  | 'containerType'
  | 'category'
  | 'itemCount'
  | 'affirmLiability'
  | 'tosAccepted'
  | 'dangerousGoods'
  | 'photoUris'
  | 'statusChangeTime'

export interface LineItemCreationAttributes
  extends Pick<LineItemAttributes, CreateAttrKeys> {}

@Table({
  timestamps: true,
})
export default class LineItem extends Model<
  LineItemAttributes,
  LineItemCreationAttributes
> {
  public id!: number

  @ForeignKey(() => Pallet)
  @Column
  public offerPalletId!: number

  @BelongsTo(() => Pallet, 'offerPalletId')
  public offerPallet!: Pallet

  @Column(DataType.STRING)
  public status!: LineItemStatus

  @ForeignKey(() => Group)
  @Column
  public proposedReceivingGroupId?: number

  @BelongsTo(() => Group, 'proposedReceivingGroupId')
  public proposedReceivingGroup?: Group

  @ForeignKey(() => Group)
  @Column
  public acceptedReceivingGroupId?: number

  @BelongsTo(() => Group, 'acceptedReceivingGroupId')
  public acceptedReceivingGroup?: Group

  @Column(DataType.STRING)
  public containerType!: LineItemContainerType

  @Column(DataType.STRING)
  public category!: LineItemCategory

  @Column
  public description?: string

  @Column
  public itemCount!: number

  @Column
  public containerCount?: number

  @Column
  public containerWeightKilos?: number

  @Column
  public containerLengthCm?: number

  @Column
  public containerWidthCm?: number

  @Column
  public containerHeightCm?: number

  @Column
  public affirmLiability!: boolean

  @Column
  public tosAccepted!: boolean

  @Column(DataType.JSONB)
  public dangerousGoods!: DangerousGoods[]

  @Column(DataType.JSONB)
  public photoUris!: string[]

  @Column
  public sendingHubDeliveryDate?: Date

  @Column
  public statusChangeTime!: Date

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date
}
