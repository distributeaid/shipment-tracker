import {
  Column,
  CreatedAt,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'
import { UserProfile } from '../server-internal-types'

export interface UserAccountAttributes {
  id: number
  username: string
  passwordHash: string
  token: string
}

export interface UserAccountCreationAttributes
  extends Optional<UserAccountAttributes, 'id'> {}

@Table({
  timestamps: true,
})
export default class UserAccount extends Model<
  UserAccountAttributes,
  UserAccountCreationAttributes
> {
  public id!: number

  @Unique
  @Column
  public username!: string

  @Column
  public passwordHash!: string

  @Column
  public token!: string

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date

  public asProfile(groupId?: number, isAdmin = false): UserProfile {
    return {
      id: this.id,
      username: this.username,
      isAdmin,
      groupId,
    }
  }
}
