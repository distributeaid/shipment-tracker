import { Resolvers, MutationAddGroupArgs } from './server-internal-types'
import { sequelize } from './sequelize'
import Group from './models/group'

const resolvers: Resolvers = {
  Query: {
    groups: async (parent, args, ctx) => {
      const groupList: Group[] = await Group.findAll()

      return groupList.map((group) => ({ id: group.id, name: group.name }))
    },
  },
  Mutation: {
    addGroup: async (parent, args: MutationAddGroupArgs, ctx) => {
      const group: Group = await Group.create({
        name: args.name,
      })

      return { id: group.id, name: group.name }
    },
  },
}

export default resolvers
