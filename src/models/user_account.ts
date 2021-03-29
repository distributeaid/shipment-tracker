import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'
import { GoogleAuthState, UserProfile } from '../server-internal-types'

export interface UserAccountAttributes {
  id: number
  auth0Id: string
  googleAuthState?: GoogleAuthState
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

  @Column(DataType.JSONB)
  public googleAuthState: GoogleAuthState | undefined

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date

  public asProfile(isAdmin = false): UserProfile {
    return {
      id: this.id,
      isAdmin,
      googleAuthState: this.googleAuthState,
    }
  }
}
