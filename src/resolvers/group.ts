import { Type } from '@sinclair/typebox'
import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import { strict as assert } from 'assert'
import { FindOptions, Op } from 'sequelize'
import { getCountryByCountryCode } from '../data/getCountryByCountryCode'
import { Contact } from '../input-validation/Contact'
import { validateIdInput } from '../input-validation/idInputSchema'
import { Location } from '../input-validation/Location'
import {
  DateTime,
  ID,
  NonEmptyShortString,
  OptionalValueOrUnset,
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
  primaryLocation: {
    ...group.primaryLocation,
    country:
      group.primaryLocation.country === undefined
        ? undefined
        : getCountryByCountryCode(group.primaryLocation.country),
  },
  termsAndConditionsAcceptedAt: group.termsAndConditionsAcceptedAt,
})

// Group query resolvers

const listGroupsInput = Type.Object(
  {
    groupType: Type.Optional(Type.Array(Type.Enum(GroupType))),
    captainId: Type.Optional(ID),
  },
  { additionalProperties: false },
)

const validateListGroupsInput = validateWithJSONSchema(listGroupsInput)

const listGroups: QueryResolvers['listGroups'] = async (_, input) => {
  const valid = validateListGroupsInput(input)
  if ('errors' in valid) {
    throw new UserInputError('List groups arguments invalid', valid.errors)
  }

  const query = {} as FindOptions<Group['_attributes']>

  const { groupType, captainId } = valid.value

  if (groupType !== undefined || captainId !== undefined) {
    query.where = {}

    if (groupType !== undefined) {
      query.where.groupType = {
        [Op.in]: groupType,
      }
    }

    if (captainId !== undefined) {
      query.where.captainId = captainId
    }
  }

  const groups = await Group.findAll(query)

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
    primaryLocation: Location,
    primaryContact: Contact,
    website: Type.Optional(URI),
    description: Description,
    termsAndConditionsAcceptedAt: DateTime,
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
    ...{
      ...valid.value,
      termsAndConditionsAcceptedAt: new Date(
        valid.value.termsAndConditionsAcceptedAt,
      ),
    },
    captainId: context.auth.userId,
  })

  return dbToGraphQL(group)
}

// - update a group

export const updateGroupInput = Type.Object(
  {
    name: Type.Optional(NonEmptyShortString),
    groupType: Type.Optional(Type.Enum(GroupType)),
    primaryLocation: Type.Optional(Location),
    primaryContact: Type.Optional(Contact),
    website: OptionalValueOrUnset(URI),
    captainId: Type.Optional(ID),
    description: Description,
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

  const updateAttributes: Partial<
    Omit<GroupAttributes, 'id' | 'termsAndConditionsAcceptedAt'>
  > = {}

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
  if (valid.value.primaryLocation !== undefined) {
    updateAttributes.primaryLocation = valid.value.primaryLocation
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

  const updatedGroup = await group.update(updateAttributes)

  return dbToGraphQL(updatedGroup)
}

// Group custom resolvers

export { addGroup, updateGroup, group, listGroups }
