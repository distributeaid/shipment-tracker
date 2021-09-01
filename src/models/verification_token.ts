import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'
import UserAccount from './user_account'

export interface VerificationTokenAttributes {
  id: number
  userAccountId: number
  token: string
}

export interface VerificationTokenCreationAttributes
  extends Optional<VerificationTokenAttributes, 'id'> {}

@Table({
  timestamps: true,
})
/**
 * FIXME: implement deleting old tokens
 */
export default class VerificationToken extends Model<
  VerificationTokenAttributes,
  VerificationTokenCreationAttributes
> {
  public id!: number

  @ForeignKey(() => UserAccount)
  @Column
  public userAccountId!: number

  @BelongsTo(() => UserAccount, 'userAccountId')
  public userAccount!: UserAccount

  @Column
  public token!: string

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date

  public static async findByUserAccountAndToken(
    userAccount: UserAccount,
    token: string,
  ): Promise<VerificationToken | undefined> {
    const t = await VerificationToken.findOne({
      where: {
        userAccountId: userAccount.id,
        token,
      },
      order: [['createdAt', 'DESC']],
    })
    if (
      t === null ||
      t.createdAt.getTime() < Date.now() - 15 * 60 * 60 * 1000 // Tokens expire after 15 minutes
    ) {
      return
    }
    return t
  }
}
