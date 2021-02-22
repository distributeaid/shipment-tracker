import gql from 'graphql-tag'
import { ApolloServerTestClient } from 'apollo-server-testing'
import makeTestServer from '../testServer'
import { sequelize } from '../sequelize'
import Group from '../models/group'

describe('Groups API', () => {
  let testServer: ApolloServerTestClient

  beforeEach(async () => {
    testServer = makeTestServer()

    await sequelize.sync({ force: true })
    await sequelize.getRepository(Group).truncate()
  })

  describe('addGroup', () => {
    it('adds a new group', async () => {
      const ADD_GROUP = gql`
        mutation($name: String!) {
          addGroup(name: $name) {
            id
            name
          }
        }
      `

      const res = await testServer.mutate({
        mutation: ADD_GROUP,
        variables: { name: 'test name' },
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.addGroup?.name).toEqual('test name')
      expect(res?.data?.addGroup?.id).not.toBeNull()
    })
  })

  describe('listGroups', () => {
    it('lists existing groups', async () => {
      const group1 = await createGroup('group 1')
      const group2 = await createGroup('group 2')

      const LIST_GROUPS = gql`
        query listGroups {
          listGroups {
            id
            name
          }
        }
      `

      const res = await testServer.query({
        query: LIST_GROUPS,
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.listGroups).toIncludeSameMembers([
        { id: group1.id, name: group1.name },
        { id: group2.id, name: group2.name },
      ])
    })
  })

  async function createGroup(name: string): Promise<Group> {
    return await sequelize.getRepository(Group).create({ name })
  }
})
