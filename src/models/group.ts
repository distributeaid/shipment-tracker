import { Optional } from 'sequelize'
import {
  Model,
  Column,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'

export interface GroupAttributes {
  id: number
  name: string
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

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date
}
