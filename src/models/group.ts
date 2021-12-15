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
import { ContactInfo, GroupType, Location } from '../server-internal-types'
import UserAccount from './user_account'

export interface GroupAttributes {
  id: number
  name: string
  description?: string | null
  groupType: GroupType
  primaryLocation: Location
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

  @Column(DataType.JSONB)
  public primaryLocation!: Location

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
