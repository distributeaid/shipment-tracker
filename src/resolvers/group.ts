import { Type } from '@sinclair/typebox'
import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import { has } from 'lodash'
import Group, { GroupAttributes } from '../models/group'
import UserAccount from '../models/user_account'
import {
  GroupType,
  MutationResolvers,
  QueryResolvers,
} from '../server-internal-types'
import {
  Email,
  NonEmptyShortString,
  OpenLocationCode,
  PhoneNumber,
  TwoLetterCountryCode,
  URI,
} from './input-validation/types'
import { validateWithJSONSchema } from './input-validation/validateWithJSONSchema'
import stringIsUrl from './stringIsUrl'

// Group query resolvers
const listGroups: QueryResolvers['listGroups'] = async () => {
  return Group.findAll()
}

const group: QueryResolvers['group'] = async (_, { id }) => {
  const group = await Group.findByPk(id)
  if (!group) {
    throw new ApolloError('No group exists with that ID')
  }

  return group
}

export const addGroupInputSchema = Type.Object(
  {
    name: NonEmptyShortString,
    groupType: Type.Enum(GroupType),
    primaryLocation: Type.Object({
      townCity: NonEmptyShortString,
      countryCode: Type.Optional(TwoLetterCountryCode),
      openLocationCode: Type.Optional(OpenLocationCode),
    }),
    primaryContact: Type.Object({
      name: NonEmptyShortString,
      email: Type.Optional(Email),
      phone: Type.Optional(PhoneNumber),
      signal: Type.Optional(PhoneNumber),
      whatsApp: Type.Optional(PhoneNumber),
    }),
    website: Type.Optional(URI),
  },
  { additionalProperties: false },
)

const validateAddGroupInput = validateWithJSONSchema(addGroupInputSchema)

// Group mutation resolvers
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

const updateGroup: MutationResolvers['updateGroup'] = async (
  _,
  { id, input },
  context,
) => {
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

  if (
    input.groupType &&
    input.groupType !== group.groupType &&
    !context.auth.isAdmin
  ) {
    throw new ForbiddenError('Not permitted to change group type')
  }

  const updateAttributes: Partial<Omit<GroupAttributes, 'id'>> = {}

  if (input.name) updateAttributes.name = input.name
  if (input.groupType) updateAttributes.groupType = input.groupType
  if (input.primaryContact) {
    updateAttributes.primaryContact = input.primaryContact
  }
  if (input.primaryLocation) {
    updateAttributes.primaryLocation = input.primaryLocation
  }

  if (has(input, 'website')) {
    if (input.website && !stringIsUrl(input.website)) {
      throw new UserInputError(`URL is not valid: ${input.website}`)
    }

    updateAttributes.website = input.website || null
  }

  if (input.captainId) {
    const captain = await UserAccount.findByPk(input.captainId)

    if (!captain) {
      throw new UserInputError(
        `No user account found with id ${input.captainId}`,
      )
    }

    updateAttributes.captainId = input.captainId
  }

  return group.update(updateAttributes)
}

// Group custom resolvers

export { addGroup, updateGroup, group, listGroups }
