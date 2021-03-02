import { Optional } from 'sequelize'
import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
} from 'sequelize-typescript'
import { GroupType } from '../server-internal-types'

export interface GroupAttributes {
  id: number
  name: string
  groupType: GroupType
}

export interface GroupCreationAttributes
  extends Optional<GroupAttributes, 'id'> {}

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

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date
}
