import gql from 'graphql-tag'
import { ApolloServerTestClient } from 'apollo-server-testing'

import { makeTestServer } from '../testServer'
import { sequelize } from '../sequelize'
import Group from '../models/group'
import { createGroup } from './helpers'
import { GroupType } from '../server-internal-types'

describe('Groups API', () => {
  let testServer: ApolloServerTestClient

  const group1Name: string = 'group1'
  const group1Params = {
    name: group1Name,
    groupType: GroupType.DaHub,
    primaryLocation: { countryCode: 'UK', townCity: 'Bristol' },
    primaryContact: { name: 'Contact', email: 'contact@example.com' },
  }

  beforeEach(async () => {
    await sequelize
      .getRepository(Group)
      .truncate({ cascade: true, force: true })
    await sequelize.sync({ force: true })

    testServer = await makeTestServer()
  })

  describe('addGroup', () => {
    it('adds a new group', async () => {
      const ADD_GROUP = gql`
        mutation(
          $name: String!
          $groupType: GroupType!
          $primaryLocation: LocationInput!
          $primaryContact: ContactInfoInput!
        ) {
          addGroup(
            input: {
              name: $name
              groupType: $groupType
              primaryLocation: $primaryLocation
              primaryContact: $primaryContact
            }
          ) {
            id
            name
            groupType
          }
        }
      `

      const res = await testServer.mutate({
        mutation: ADD_GROUP,
        variables: group1Params,
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.addGroup?.name).toEqual(group1Name)
      expect(res?.data?.addGroup?.id).not.toBeNull()
    })
  })

  describe('listGroups', () => {
    it('lists existing groups', async () => {
      const group1 = await createGroup(group1Params)
      const group2 = await createGroup({
        name: 'group 2',
        groupType: GroupType.ReceivingGroup,
        primaryLocation: { countryCode: 'FR', townCity: 'Bordeaux' },
        primaryContact: {
          name: 'Second Contact',
          email: '2ndcontact@example.com',
        },
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

  describe('group', () => {
    let group1: Group
    const GROUP = gql`
      query($id: Int!) {
        group(id: $id) {
          id
          name
        }
      }
    `
    beforeEach(async () => {
      group1 = await createGroup(group1Params)
    })

    describe('with no id', () => {
      it('returns an error', async () => {
        const res = await testServer.query({ query: GROUP })

        expect(res.errors).not.toBeUndefined()
        expect(res.errors).not.toBeEmpty()

        if (!res.errors) {
          return
        }

        expect(res.errors[0].message).toBe(
          'Variable "$id" of required type "Int!" was not provided.',
        )
      })
    })

    describe('with a parameter passed in', () => {
      describe('a valid id', () => {
        it('returns the correct group', async () => {
          const res = await testServer.query({
            query: GROUP,
            variables: { id: 1 },
          })

          expect(res?.errors).toBeUndefined()
          expect(res?.data?.group.name).toBe(group1Name)
        })
      })

      describe('with an invalid id', () => {
        it('returns a nice error', async () => {
          const res = await testServer.query({
            query: GROUP,
            variables: { id: 17 },
          })

          expect(res.errors).not.toBeUndefined()
          expect(res.errors).not.toBeEmpty()

          if (!res.errors) {
            return
          }

          expect(res.errors[0].message).toBe('No group exists with that ID')
        })
      })
    })
  })
})
