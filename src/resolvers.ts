import { UserInputError } from 'apollo-server'
import { Resolvers, MutationAddGroupArgs } from './server-internal-types'
import { sequelize } from './sequelize'
import Group from './models/group'

const groupRepository = sequelize.getRepository(Group)

const resolvers: Resolvers = {
  Query: {
    listGroups: async (parent, args, ctx) => {
      const groupList: Group[] = await groupRepository.findAll()

      return groupList.map((group) => ({ id: group.id, name: group.name }))
    },
  },
  Mutation: {
    addGroup: async (parent, args: MutationAddGroupArgs, ctx) => {
      if (!args.name) {
        throw new UserInputError('Group arguments invalid', {
          invalidArgs: Object.keys(args),
        })
      }

      const group: Group = await groupRepository.create({
        name: args.name,
      })

      return { id: group.id, name: group.name }
    },
  },
}

export default resolvers
