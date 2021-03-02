import gql from 'graphql-tag'
import { ApolloServerTestClient } from 'apollo-server-testing'

import makeTestServer from '../testServer'
import { sequelize } from '../sequelize'
import Group from '../models/group'
import { createGroup } from './helpers'
import { GroupType } from '../server-internal-types'

describe('Groups API', () => {
  let testServer: ApolloServerTestClient

  beforeEach(async () => {
    testServer = makeTestServer()

    await sequelize.sync({ force: true })
    await sequelize
      .getRepository(Group)
      .truncate({ cascade: true, force: true })
  })

  describe('addGroup', () => {
    it('adds a new group', async () => {
      const ADD_GROUP = gql`
        mutation($name: String!, $groupType: GroupType!) {
          addGroup(input: { name: $name, groupType: $groupType }) {
            id
            name
            groupType
          }
        }
      `

      const res = await testServer.mutate({
        mutation: ADD_GROUP,
        variables: { name: 'test name', groupType: GroupType.ReceivingGroup },
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.addGroup?.name).toEqual('test name')
      expect(res?.data?.addGroup?.id).not.toBeNull()
    })
  })

  describe('listGroups', () => {
    it('lists existing groups', async () => {
      const group1 = await createGroup({
        name: 'group 1',
        groupType: GroupType.DaHub,
      })
      const group2 = await createGroup({
        name: 'group 2',
        groupType: GroupType.ReceivingGroup,
      })

      const LIST_GROUPS = gql`
        query listGroups {
          listGroups {
            id
            name
            groupType
          }
        }
      `

      const res = await testServer.query({
        query: LIST_GROUPS,
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.listGroups).toIncludeSameMembers([
        { id: group1.id, name: group1.name, groupType: group1.groupType },
        { id: group2.id, name: group2.name, groupType: group2.groupType },
      ])
    })
  })
})
