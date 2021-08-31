import {
  BeforeCreate,
  Column,
  CreatedAt,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'

export interface PasswordResetTokenAttributes {
  id: number
  email: string
  token: string
}

export interface PasswordResetTokenCreationAttributes
  extends Optional<PasswordResetTokenAttributes, 'id'> {}

@Table({
  timestamps: true,
})
/**
 * FIXME: implement deleting old tokens
 */
export default class PasswordResetToken extends Model<
  PasswordResetTokenAttributes,
  PasswordResetTokenCreationAttributes
> {
  public id!: number

  @Unique
  @Column
  public email!: string

  @BeforeCreate
  static lowerCaseEmail(instance: PasswordResetToken) {
    instance.email = instance.email.toLowerCase()
  }

  @Column
  public token!: string

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date
}
