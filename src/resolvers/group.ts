import { Type } from '@sinclair/typebox'
import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import { FindOptions, Op } from 'sequelize'
import Group, { GroupAttributes } from '../models/group'
import UserAccount from '../models/user_account'
import {
  GroupType,
  MutationResolvers,
  QueryResolvers,
} from '../server-internal-types'
import { Contact } from './input-validation/Contact'
import { validateIdInput } from './input-validation/idInputSchema'
import { Location } from './input-validation/Location'
import {
  ID,
  NonEmptyShortString,
  OptionalValueOrUnset,
  URI,
} from './input-validation/types'
import { validateWithJSONSchema } from './input-validation/validateWithJSONSchema'

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

  return Group.findAll(query)
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

  return group
}

// Group mutation resolvers

// - add a group
export const addGroupInputSchema = Type.Object(
  {
    name: NonEmptyShortString,
    groupType: Type.Enum(GroupType),
    primaryLocation: Location,
    primaryContact: Contact,
    website: Type.Optional(URI),
  },
  { additionalProperties: false },
)

const validateAddGroupInput = validateWithJSONSchema(addGroupInputSchema)

const addGroup: MutationResolvers['addGroup'] = async (
  _parent,
  { input },
  context,
) => {
  const valid = validateAddGroupInput(input)
  if ('errors' in valid) {
    throw new UserInputError('Group arguments invalid', valid.errors)
  }

  // Non-admins should only be allowed to create sending groups
  if (
    valid.value.groupType !== GroupType.SendingGroup &&
    !context.auth.isAdmin
  ) {
    throw new ForbiddenError(`Non-admins can only create sending groups`)
  }

  // Non-admins are only allowed to create a single group
  if (!context.auth.isAdmin) {
    const numGroupsForUser = await Group.count({
      where: { captainId: context.auth.userAccount.id },
    })

    if (numGroupsForUser > 0) {
      throw new ForbiddenError('Group captains can only create a single group')
    }
  }

  return Group.create({
    ...valid.value,
    captainId: context.auth.userAccount.id,
  })
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
  },
  { additionalProperties: false },
)

const validateUpdateGroupInput = validateWithJSONSchema(updateGroupInput)

const updateGroup: MutationResolvers['updateGroup'] = async (
  _,
  { id, input },
  context,
) => {
  const valid = validateUpdateGroupInput(input)
  if ('errors' in valid) {
    throw new UserInputError('Update group arguments invalid', valid.errors)
  }

  const group = await Group.findByPk(id)

  if (!group) {
    throw new UserInputError(`Group ${id} does not exist`)
  }

  if (
    group.captainId !== context.auth.userAccount.id &&
    !context.auth.isAdmin
  ) {
    throw new ForbiddenError('Not permitted to update group')
  }

  const updateAttributes: Partial<Omit<GroupAttributes, 'id'>> = {}

  if (valid.value.name !== undefined) updateAttributes.name = valid.value.name

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

  return group.update(updateAttributes)
}

// Group custom resolvers

export { addGroup, updateGroup, group, listGroups }
