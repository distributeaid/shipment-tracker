import { Type } from '@sinclair/typebox'
import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import { strict as assert } from 'assert'
import { Attributes, Op, WhereOptions } from 'sequelize'
import { countries } from '../data/countries'
import { getCountryByCountryCode } from '../data/getCountryByCountryCode'
import { knownRegions } from '../data/regions'
import { Contact } from '../input-validation/Contact'
import { validateIdInput } from '../input-validation/idInputSchema'
import {
  ID,
  NonEmptyShortString,
  OptionalValueOrUnset,
  TwoLetterCountryCode,
  URI,
} from '../input-validation/types'
import { validateWithJSONSchema } from '../input-validation/validateWithJSONSchema'
import Group, { GroupAttributes } from '../models/group'
import UserAccount from '../models/user_account'
import {
  GroupType,
  MutationResolvers,
  QueryResolvers,
  ResolversTypes,
} from '../server-internal-types'

export const dbToGraphQL = (group: Group): ResolversTypes['Group'] => ({
  ...group.get({ plain: true }),
  createdAt: group.createdAt,
  updatedAt: group.updatedAt,
  country: getCountryByCountryCode(group.country),
  servingRegions: group.servingRegions?.map((id) => knownRegions[id]) ?? [],
})

// Group query resolvers

const listGroupsInput = Type.Object(
  {
    groupType: Type.Optional(Type.Array(Type.Enum(GroupType))),
    captainId: Type.Optional(ID),
    region: Type.Optional(
      Type.Union(
        Object.keys(knownRegions).map((id) => Type.Literal(id)),
        { title: 'region ID' },
      ),
    ),
  },
  { additionalProperties: false },
)

const validateListGroupsInput = validateWithJSONSchema(listGroupsInput)

const listGroups: QueryResolvers['listGroups'] = async (_, input) => {
  const valid = validateListGroupsInput(input)
  if ('errors' in valid) {
    throw new UserInputError('List groups arguments invalid', valid.errors)
  }

  const { groupType, captainId, region } = valid.value

  const where: WhereOptions<Attributes<Group>> = {}

  if (groupType !== undefined) {
    where.groupType = {
      [Op.in]: groupType,
    }
  }

  if (captainId !== undefined) {
    where.captainId = captainId
  }

  if (region !== undefined) {
    where.servingRegions = {
      [Op.contained]: [region],
    }
  }

  const groups = await Group.findAll({ where })

  return groups.map(dbToGraphQL)
}

const group: QueryResolvers['group'] = async (_, { id }) => {
  const valid = validateIdInput({ id })
  if ('errors' in valid) {
    throw new UserInputError('Group arguments invalid', valid.errors)
  }

  const group = await Group.findByPk(valid.value.id)
  if (!group) {
    throw new ApolloError(`No group exists with ID ${valid.value.id}`)
  }

  return dbToGraphQL(group)
}

// Group mutation resolvers

const Description = Type.Optional(
  Type.String({
    minLength: 0,
    title: 'Description',
  }),
)

// - add a group
export const addGroupInputSchema = Type.Object(
  {
    name: NonEmptyShortString,
    groupType: Type.Enum(GroupType),
    locality: NonEmptyShortString,
    country: TwoLetterCountryCode,
    primaryContact: Contact,
    website: Type.Optional(URI),
    description: Description,
    servingRegions: Type.Optional(
      Type.Array(
        Type.Union(
          Object.keys(knownRegions).map((id) => Type.Literal(id)),
          { title: 'Region ID' },
        ),
      ),
    ),
  },
  { additionalProperties: false },
)

const validateAddGroupInput = validateWithJSONSchema(addGroupInputSchema)

const addGroup: MutationResolvers['addGroup'] = async (
  _parent,
  { input },
  context,
) => {
  assert.ok(
    typeof context.auth.userId === 'number',
    'Current user id should be set',
  )
  const valid = validateAddGroupInput(input)
  if ('errors' in valid) {
    throw new UserInputError('Group arguments invalid', valid.errors)
  }

  // Non-admins should only be allowed to create regular groups
  if (valid.value.groupType !== GroupType.Regular && !context.auth.isAdmin) {
    throw new ForbiddenError(`Non-admins can only create regular groups`)
  }

  // Non-admins are only allowed to create a single group
  if (!context.auth.isAdmin) {
    const numGroupsForUser = await Group.count({
      where: { captainId: context.auth.userId },
    })

    if (numGroupsForUser > 0) {
      throw new ForbiddenError('Group captains can only create a single group')
    }
  }

  const group = await Group.create({
    ...valid.value,
    country: valid.value.country as keyof typeof countries,
    captainId: context.auth.userId,
    servingRegions:
      (valid.value.servingRegions as
        | Array<keyof typeof knownRegions>
        | undefined) ?? [],
  })

  return dbToGraphQL(group)
}

// - update a group

export const updateGroupInput = Type.Object(
  {
    name: Type.Optional(NonEmptyShortString),
    groupType: Type.Optional(Type.Enum(GroupType)),
    locality: Type.Optional(NonEmptyShortString),
    country: Type.Optional(TwoLetterCountryCode),
    primaryContact: Type.Optional(Contact),
    website: OptionalValueOrUnset(URI),
    captainId: Type.Optional(ID),
    description: Description,
    servingRegions: Type.Optional(
      Type.Array(
        Type.Union(
          Object.keys(knownRegions).map((id) => Type.Literal(id)),
          { title: 'Region ID' },
        ),
      ),
    ),
  },
  { additionalProperties: false },
)

const validateUpdateGroupInput = validateWithJSONSchema(updateGroupInput)

const updateGroup: MutationResolvers['updateGroup'] = async (
  _,
  { id, input },
  context,
) => {
  assert.ok(
    typeof context.auth.userId === 'number',
    'Current user id should be set',
  )
  const valid = validateUpdateGroupInput(input)
  if ('errors' in valid) {
    throw new UserInputError('Update group arguments invalid', valid.errors)
  }

  const group = await Group.findByPk(id)

  if (!group) {
    throw new UserInputError(`Group ${id} does not exist`)
  }

  if (group.captainId !== context.auth.userId && !context.auth.isAdmin) {
    throw new ForbiddenError('Not permitted to update group')
  }

  const updateAttributes: Partial<Omit<GroupAttributes, 'id'>> = {}

  if (valid.value.name !== undefined) updateAttributes.name = valid.value.name

  if (valid.value.description !== undefined)
    updateAttributes.description = valid.value.description

  if (valid.value.groupType !== undefined) {
    if (valid.value.groupType !== group.groupType && !context.auth.isAdmin) {
      throw new ForbiddenError('Not permitted to change group type')
    }
    updateAttributes.groupType = valid.value.groupType
  }

  if (valid.value.primaryContact !== undefined) {
    updateAttributes.primaryContact = valid.value.primaryContact
  }
  if (valid.value.country !== undefined) {
    updateAttributes.country = valid.value.country as keyof typeof countries
  }
  if (valid.value.locality !== undefined) {
    updateAttributes.locality = valid.value.locality
  }

  if (valid.value.website !== undefined) {
    updateAttributes.website = valid.value.website
  }

  if (valid.value.captainId !== undefined) {
    const captain = await UserAccount.findByPk(valid.value.captainId)

    if (!captain) {
      throw new UserInputError(
        `No user account found with id ${valid.value.captainId}`,
      )
    }

    updateAttributes.captainId = captain.id
  }

  if (valid.value.servingRegions !== undefined) {
    updateAttributes.servingRegions = valid.value.servingRegions as Array<
      keyof typeof knownRegions
    >
  }

  const updatedGroup = await group.update(updateAttributes)

  return dbToGraphQL(updatedGroup)
}

// Group custom resolvers

export { addGroup, updateGroup, group, listGroups }
