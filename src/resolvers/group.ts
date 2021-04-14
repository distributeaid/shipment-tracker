import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import { has } from 'lodash'
import Group, { GroupAttributes } from '../models/group'
import UserAccount from '../models/user_account'
import {
  GroupCreateInput,
  GroupType,
  MutationResolvers,
  QueryResolvers,
} from '../server-internal-types'
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
// Group mutation resolvers
const addGroup: MutationResolvers['addGroup'] = async (
  _parent,
  { input },
  context,
) => {
  if (
    !input.name ||
    !input.groupType ||
    !input.primaryLocation ||
    !input.primaryContact
  ) {
    throw new UserInputError('Group arguments invalid', {
      invalidArgs: Object.keys(input).filter(
        (key) => !input[key as keyof GroupCreateInput],
      ),
    })
  }

  // Non-admins should only be allowed to create sending groups
  if (input.groupType !== GroupType.SendingGroup && !context.auth.isAdmin) {
    throw new ForbiddenError(`Non-admins can only create sending groups`)
  }

  if (input.website && !stringIsUrl(input.website)) {
    throw new UserInputError(`URL is not valid: ${input.website}`)
  }

  return Group.create({
    name: input.name,
    groupType: input.groupType,
    primaryLocation: input.primaryLocation,
    primaryContact: input.primaryContact,
    website: input.website,
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
