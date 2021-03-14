import { ApolloError, UserInputError } from 'apollo-server'
import Group from '../../models/group'
import {
  GroupCreateInput,
  MutationResolvers,
  QueryResolvers,
} from '../../server-internal-types'

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

  return Group.create({
    name: input.name,
    groupType: input.groupType,
    primaryLocation: input.primaryLocation,
    primaryContact: input.primaryContact,
    website: input.website,
    captainId: context.auth.userAccount.id,
  })
}

// Group custom resolvers

export { addGroup, group, listGroups }
