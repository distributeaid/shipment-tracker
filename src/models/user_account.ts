import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'
import { UserProfile } from '../server-internal-types'

export interface UserAccountAttributes {
  id: number
  auth0Id: string
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

  @Column
  public auth0Id!: string

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date

  public asProfile(groupId?: number, isAdmin = false): UserProfile {
    return {
      id: this.id,
      isAdmin,
      groupId,
    }
  }
}
