import { ApolloError, UserInputError } from 'apollo-server'

import {
  QueryResolvers,
  MutationResolvers,
  GroupInput,
} from '../../server-internal-types'
import { sequelize } from '../../sequelize'
import Group from '../../models/group'

const groupRepository = sequelize.getRepository(Group)

// Group query resolvers
const listGroups: QueryResolvers['listGroups'] = async () => {
  return groupRepository.findAll()
}

const group: QueryResolvers['group'] = async (_, { id }) => {
  const group = await groupRepository.findByPk(id)
  if (!group) {
    throw new ApolloError('No group exists with that ID')
  }

  return group
}
// Group mutation resolvers
const addGroup: MutationResolvers['addGroup'] = async (
  _parent,
  { input },
  _context,
) => {
  if (
    !input.name ||
    !input.groupType ||
    !input.primaryLocation ||
    !input.primaryContact
  ) {
    throw new UserInputError('Group arguments invalid', {
      invalidArgs: Object.keys(input).filter(
        (key) => !input[key as keyof GroupInput],
      ),
    })
  }

  return groupRepository.create({
    name: input.name,
    groupType: input.groupType,
    primaryLocation: input.primaryLocation,
    primaryContact: input.primaryContact,
    website: input.website,
  })
}

// Group custom resolvers

export { addGroup, group, listGroups }
