import gql from 'graphql-tag'
import { ApolloServerTestClient } from 'apollo-server-testing'

import { makeTestServer } from '../testServer'
import { sequelize } from '../sequelize'
import Group from '../models/group'
import { createGroup } from './helpers'
import { GroupType } from '../server-internal-types'

describe('Groups API', () => {
  let testServer: ApolloServerTestClient

  const group1Name: string = "group1"
  const group1Params = {
    name: group1Name,
    groupType: GroupType.DaHub,
    primaryLocation: { countryCode: "UK", townCity: "Bristol" },
    primaryContact:  { name: "Contact", email: "contact@example.com" }
  }

  beforeEach(async () => {
    testServer = makeTestServer()

    await sequelize.sync({ force: true })
    await sequelize
      .getRepository(Group)
      .truncate({ cascade: true, force: true })
  })

  describe('addGroup', () => {
    it('adds a new group', async () => {
      const group1 = await createGroup(group1Params)

      expect(group1.name).toBe(group1Name)
    })
  })

  describe('listGroups', () => {
    it('lists existing groups', async () => {
      const group1 = await createGroup(group1Params)
      const group2 = await createGroup({
        name: 'group 2',
        groupType: GroupType.ReceivingGroup,
        primaryLocation: { countryCode: "FR", townCity: "Bordeaux" },
        primaryContact:  {
          name: "Second Contact",
          email: "2ndcontact@example.com"
        }
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
