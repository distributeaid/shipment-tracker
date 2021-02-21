import { Optional } from 'sequelize'
import {Model, Column, Table, CreatedAt, UpdatedAt} from "sequelize-typescript";

export interface GroupAttributes {
  id: number
  name: string
}

export interface GroupCreationAttributes extends Optional<GroupAttributes, 'id'> {}

@Table({
  timestamps: true,
})
export default class Group extends Model<GroupAttributes, GroupCreationAttributes> {

  @Column
  public name!: string

  @CreatedAt
  @Column
  public createdAt!: Date;

  @UpdatedAt
  @Column
  public updatedAt!: Date;
}
