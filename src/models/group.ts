import { Optional } from 'sequelize'
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
import { countries } from '../data/countries'
import { ContactInfo, GroupType } from '../server-internal-types'
import UserAccount from './user_account'

export interface GroupAttributes {
  id: number
  name: string
  description?: string | null
  groupType: GroupType
  country: keyof typeof countries
  locality: string
  primaryContact: ContactInfo
  website?: string | null
  captainId: number
}

export interface GroupCreationAttributes
  extends Optional<GroupAttributes, 'id' | 'website' | 'description'> {}

@Table({
  timestamps: true,
})
export default class Group extends Model<
  GroupAttributes,
  GroupCreationAttributes
> {
  public id!: number

  @Column
  public name!: string

  @Column
  public description?: string

  @Column(DataType.STRING)
  public groupType!: GroupType

  @Column(DataType.STRING)
  public country!: GroupAttributes['country']

  @Column(DataType.STRING)
  public locality!: GroupAttributes['locality']

  @Column(DataType.JSONB)
  public primaryContact!: ContactInfo

  @Column
  public website?: string

  @ForeignKey(() => UserAccount)
  @Column
  public captainId!: number

  @BelongsTo(() => UserAccount, 'captainId')
  public captain!: UserAccount

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date
}
