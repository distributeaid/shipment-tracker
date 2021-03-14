import gql from 'graphql-tag'
import { ApolloServerTestClient } from 'apollo-server-testing'
import { omit } from 'lodash'
import { makeAdminTestServer, makeTestServer } from '../testServer'
import { sequelize } from '../sequelize'
import Group, { GroupAttributes } from '../models/group'
import { createGroup } from './helpers'
import { GroupType } from '../server-internal-types'
import UserAccount from '../models/user_account'
import { fakeUserAuth } from '../authenticateRequest'

describe('Groups API', () => {
  let otherUserTestServer: ApolloServerTestClient,
    testServer: ApolloServerTestClient,
    adminTestServer: ApolloServerTestClient,
    captain: UserAccount,
    newCaptain: UserAccount

  const group1Name: string = 'group1'
  const group1Params = {
    name: group1Name,
    groupType: GroupType.DaHub,
    primaryLocation: { countryCode: 'UK', townCity: 'Bristol' },
    primaryContact: { name: 'Contact', email: 'contact@example.com' },
    website: 'www.example.com',
  }

  beforeEach(async () => {
    await UserAccount.truncate({ cascade: true, force: true })
    await Group.truncate({ cascade: true, force: true })
    await sequelize.sync({ force: true })

    captain = await UserAccount.create({
      auth0Id: 'captain-id',
    })

    newCaptain = await UserAccount.create({
      auth0Id: 'new-captain-id',
    })

    testServer = await makeTestServer({
      context: () => ({ auth: { ...fakeUserAuth, userAccount: captain } }),
    })
    otherUserTestServer = await makeTestServer()
    adminTestServer = await makeAdminTestServer()
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

  describe('updateGroup', () => {
    let existingGroup: Group
    let updateParams: Partial<GroupAttributes>

    const UPDATE_GROUP = gql`
      mutation($id: Int!, $input: GroupUpdateInput!) {
        updateGroup(id: $id, input: $input) {
          id
          name
          groupType
          primaryLocation {
            countryCode
            townCity
          }
          primaryContact {
            name
            email
          }
          website
          captainId
        }
      }
    `

    beforeEach(async () => {
      updateParams = {
        name: 'updated-name',
        groupType: GroupType.ReceivingGroup,
        primaryContact: {
          name: 'updated-contact-name',
          email: 'updated@example.com',
        },
        primaryLocation: { countryCode: 'US', townCity: 'Bellingham' },
        captainId: newCaptain.id,
      }

      existingGroup = await Group.create({
        ...group1Params,
        captainId: captain.id,
      })
    })

    it('updates the group', async () => {
      const res = await adminTestServer.mutate({
        mutation: UPDATE_GROUP,
        variables: {
          id: existingGroup.id,
          input: updateParams,
        },
      })

      expect(res.errors).toBeUndefined()
      expect(res.data?.updateGroup?.name).toEqual(updateParams.name)
      expect(res.data?.updateGroup?.groupType).toEqual(GroupType.ReceivingGroup)
      expect(res.data?.updateGroup?.primaryContact?.name).toEqual(
        updateParams?.primaryContact?.name,
      )
      expect(res.data?.updateGroup?.primaryContact?.email).toEqual(
        updateParams?.primaryContact?.email,
      )
      expect(res.data?.updateGroup?.primaryLocation?.countryCode).toEqual(
        updateParams?.primaryLocation?.countryCode,
      )
      expect(res.data?.updateGroup?.primaryLocation?.townCity).toEqual(
        updateParams?.primaryLocation?.townCity,
      )
      expect(res.data?.updateGroup?.captainId).toEqual(newCaptain.id)
    })

    it('updates the group not including type for captains', async () => {
      const res = await testServer.mutate({
        mutation: UPDATE_GROUP,
        variables: {
          id: existingGroup.id,
          input: omit(updateParams, 'groupType'),
        },
      })

      expect(res.errors).toBeUndefined()
      expect(res.data?.updateGroup?.name).toEqual(updateParams.name)
    })

    it('supports setting website to null', async () => {
      const res = await adminTestServer.mutate({
        mutation: UPDATE_GROUP,
        variables: {
          id: existingGroup.id,
          input: { ...updateParams, website: null },
        },
      })

      expect(res.errors).toBeUndefined()
      expect(res.data?.updateGroup?.website).toBeNull()
    })

    it('validates the website look like a URL', async () => {
      const res = await adminTestServer.mutate({
        mutation: UPDATE_GROUP,
        variables: {
          id: existingGroup.id,
          input: { ...updateParams, website: 'www.-example.com' },
        },
      })

      expect(res.errors?.[0].message).toEqual(
        'URL is not valid: www.-example.com',
      )
    })

    it('disallows non-admins from updating group type', async () => {
      const res = await testServer.mutate({
        mutation: UPDATE_GROUP,
        variables: {
          id: existingGroup.id,
          input: updateParams,
        },
      })

      expect(res.errors?.[0].message).toEqual(
        'Not permitted to change group type',
      )
    })

    it('disallows non-admin non-captains from updating', async () => {
      const res = await otherUserTestServer.mutate({
        mutation: UPDATE_GROUP,
        variables: {
          id: existingGroup.id,
          input: updateParams,
        },
      })

      expect(res.errors?.[0].message).toEqual('Not permitted to update group')
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
