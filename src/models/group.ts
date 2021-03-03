import { Optional } from 'sequelize'
import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
} from 'sequelize-typescript'
import { GroupType, Location, ContactInfo } from '../server-internal-types'

export interface GroupAttributes {
  id: number
  name: string
  groupType: GroupType
  primaryLocation: Location
  primaryContact: ContactInfo
  website?: string
}

export interface GroupCreationAttributes
  extends Optional<GroupAttributes, 'id' | 'website'> {}

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

  @Column(DataType.STRING)
  public groupType!: GroupType

  @Column(DataType.JSONB)
  public primaryLocation!: Location

  @Column(DataType.JSONB)
  public primaryContact!: ContactInfo

  @Column
  public website?: string

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date
}
