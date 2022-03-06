import { Optional } from 'sequelize'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { countries } from '../data/countries'
import {
  ContactInfo,
  Country,
  Group as WireGroup,
  GroupType,
  Location,
} from '../server-internal-types'
import UserAccount from './user_account'

export interface GroupAttributes {
  id: number
  name: string
  description?: string | null
  groupType: GroupType
  primaryLocation: Omit<Location, 'country'> & {
    country?: typeof countries[number]['alpha2']
  }
  primaryContact: ContactInfo
  website?: string | null
  captainId: number
}

export interface GroupCreationAttributes
  extends Optional<GroupAttributes, 'id' | 'website' | 'description'> {}

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

  @Column
  public description?: string

  @Column(DataType.STRING)
  public groupType!: GroupType

  @Column(DataType.JSONB)
  public primaryLocation!: GroupAttributes['primaryLocation']

  @Column(DataType.JSONB)
  public primaryContact!: ContactInfo

  @Column
  public website?: string

  @ForeignKey(() => UserAccount)
  @Column
  public captainId!: number

  @BelongsTo(() => UserAccount, 'captainId')
  public captain!: UserAccount

  @CreatedAt
  @Column
  public readonly createdAt!: Date

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date

  public toWireFormat(): WireGroup {
    // Resolve country
    let country: Country | undefined = undefined
    if (this.primaryLocation.country !== undefined) {
      country = countries.find(
        ({ alpha2 }) => alpha2 === this.primaryLocation.country,
      )
      if (country === undefined) {
        throw new Error(
          `Unknown country ${this.primaryLocation.country} for group primary location!`,
        )
      }
    }
    return {
      ...this.get({ plain: true }),
      primaryLocation: {
        ...this.primaryLocation,
        country,
      },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  public static findAllWithCaptainAssociation() {
    return Group.findAll({ include: [{ association: 'captain' }] })
  }

  public static getWithCaptainAssociation(id: number) {
    return Group.findByPk(id, { include: [{ association: 'captain' }] })
  }
}
