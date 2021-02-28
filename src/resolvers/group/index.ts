import { UserInputError } from 'apollo-server'

import { QueryResolvers, MutationResolvers } from '../../server-internal-types'
import { sequelize } from '../../sequelize'
import Group from '../../models/group'

const groupRepository = sequelize.getRepository(Group)

// Group query resolvers
const listGroups: QueryResolvers['listGroups'] = async () => {
  return groupRepository.findAll()
}

// Group mutation resolvers
const addGroup: MutationResolvers['addGroup'] = async (
  _parent,
  args,
  _context,
) => {
  if (!args?.input?.name) {
    throw new UserInputError('Group arguments invalid', {
      invalidArgs: 'name',
    })
  }

  return groupRepository.create({ name: args.input.name })
}

export { listGroups, addGroup }
