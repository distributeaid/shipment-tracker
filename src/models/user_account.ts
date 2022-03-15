import { Maybe } from 'graphql/jsutils/Maybe'
import {
  BeforeCreate,
  Column,
  CreatedAt,
  Default,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'
import { UserProfile } from '../server-internal-types'
import Group from './group'

export interface UserAccountAttributes {
  id: number
  email: string
  passwordHash: string
  isAdmin?: boolean
  isConfirmed?: boolean
  name: string
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
  public email!: string

  @BeforeCreate
  static lowerCaseEmail(instance: UserAccount) {
    instance.email = instance.email.toLowerCase()
  }

  @Column
  public passwordHash!: string

  @Column
  public name!: string

  @Default(false)
  @Column
  public isAdmin!: boolean

  @Default(false)
  @Column
  public isConfirmed!: boolean

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date

  public async asPublicProfile(): Promise<Omit<UserProfile, 'group'>> {
    let groupForUser: Maybe<Group>
    if (!this.isAdmin) {
      // Note: this assumes that there is only 1 captain per group, where in
      // reality there are no restrictions on the number of groups with the same
      // captain. For now, we've agreed that this is okay, but we probably need
      // to solidify some restrictions later on.
      // See https://github.com/distributeaid/shipment-tracker/issues/133
      groupForUser = await Group.findOne({
        where: { captainId: this.id },
      })
    }
    return {
      id: this.id,
      isAdmin: this.isAdmin,
      name: this.name,
    }
  }

  public static findOneByEmail(email: string) {
    return UserAccount.findOne({
      where: {
        email: email.toLowerCase(),
      },
    })
  }
}
