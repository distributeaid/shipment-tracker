import { ApolloServerTestClient } from 'apollo-server-testing'
import gql from 'graphql-tag'
import { omit } from 'lodash'
import { fakeUserAuth } from '../authenticateRequest'
import Group, { GroupAttributes } from '../models/group'
import UserAccount from '../models/user_account'
import { sequelize } from '../sequelize'
import { GroupType } from '../server-internal-types'
import { makeAdminTestServer, makeTestServer } from '../testServer'

const purgeDb = async () => sequelize.sync({ force: true })

const commonGroupData = {
  primaryLocation: { countryCode: 'FR', townCity: 'Calais' },
  primaryContact: { name: 'Contact', email: 'contact@example.com' },
  website: 'http://www.example.com',
} as const

describe('Groups API', () => {
  describe('modifying', () => {
    const group1Name: string = 'group1'
    const group1Params = {
      name: group1Name,
      groupType: GroupType.SendingGroup,
      ...commonGroupData,
    }

    const group2Params = {
      name: 'group2',
      groupType: GroupType.SendingGroup,
      ...commonGroupData,
    }

    let testServer: ApolloServerTestClient,
      adminTestServer: ApolloServerTestClient,
      captain: UserAccount,
      newCaptain: UserAccount

    beforeEach(async () => {
      await purgeDb()

      // Create test servers
      captain = await UserAccount.create({
        auth0Id: 'captain-id',
      })
      newCaptain = await UserAccount.create({
        auth0Id: 'new-captain-id',
      })
      testServer = await makeTestServer({
        context: () => ({ auth: { ...fakeUserAuth, userAccount: captain } }),
      })
      adminTestServer = await makeAdminTestServer()
    })

    afterAll(purgeDb)

    describe('addGroup', () => {
      const ADD_GROUP = gql`
        mutation (
          $name: String!
          $groupType: GroupType!
          $primaryLocation: LocationInput!
          $primaryContact: ContactInfoInput!
          $website: String
        ) {
          addGroup(
            input: {
              name: $name
              groupType: $groupType
              primaryLocation: $primaryLocation
              primaryContact: $primaryContact
              website: $website
            }
          ) {
            id
            name
            groupType
          }
        }
      `

      it('adds a new group', async () => {
        const res = await testServer.mutate({
          mutation: ADD_GROUP,
          variables: group1Params,
        })

        expect(res.errors).toBeUndefined()
        expect(res?.data?.addGroup?.name).toEqual(group1Name)
        expect(res?.data?.addGroup?.id).not.toBeNull()
      })

      it('prevents group captains from creating more than 1 group', async () => {
        await testServer.mutate({
          mutation: ADD_GROUP,
          variables: group1Params,
        })

        const res = await testServer.mutate({
          mutation: ADD_GROUP,
          variables: group2Params,
        })

        expect(res.errors).not.toBeUndefined()
        if (res.errors) {
          expect(res.errors[0].message).toBe(
            'Group captains can only create a single group',
          )
        }
      })
    })

    describe('updateGroup', () => {
      let existingGroup: Group
      let updateParams: Partial<GroupAttributes>

      const UPDATE_GROUP = gql`
        mutation ($id: Int!, $input: GroupUpdateInput!) {
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
        expect(res.data?.updateGroup?.groupType).toEqual(
          GroupType.ReceivingGroup,
        )
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
          'Update group arguments invalid',
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
        const res = await (
          await makeTestServer()
        ).mutate({
          mutation: UPDATE_GROUP,
          variables: {
            id: existingGroup.id,
            input: updateParams,
          },
        })

        expect(res.errors?.[0].message).toEqual('Not permitted to update group')
      })
    })
  })

  describe('reading', () => {
    let testServer: ApolloServerTestClient
    let captain1: UserAccount, captain2: UserAccount, daCaptain: UserAccount
    let sendingGroup1: Group,
      receivingGroup1: Group,
      sendingGroup2: Group,
      receivingGroup2: Group,
      daHubGroup: Group

    const sendingGroup1Name = 'sendingGroup1'
    const sendingGroup2Name = 'sendingGroup2'
    const receivingGroup1Name = 'receivingGroup1'
    const receivingGroup2Name = 'receivingGroup2'
    const daHubGroupName = 'daHubGroup'
    const captain1Name = 'Avery'
    const captain2Name = 'Briar'
    const daCaptainName = 'Campbell'

    /**
     * Create groups for querying
     */
    beforeAll(async () => {
      captain1 = await UserAccount.create({
        auth0Id: captain1Name,
      })
      captain2 = await UserAccount.create({ auth0Id: captain2Name })
      daCaptain = await UserAccount.create({
        auth0Id: daCaptainName,
      })
      sendingGroup1 = await Group.create({
        name: sendingGroup1Name,
        groupType: GroupType.SendingGroup,
        captainId: captain1.id,
        ...commonGroupData,
      })
      sendingGroup2 = await Group.create({
        name: sendingGroup2Name,
        groupType: GroupType.SendingGroup,
        captainId: captain2.id,
        ...commonGroupData,
      })
      receivingGroup1 = await Group.create({
        name: receivingGroup1Name,
        groupType: GroupType.ReceivingGroup,
        captainId: captain2.id,
        ...commonGroupData,
      })
      receivingGroup2 = await Group.create({
        name: receivingGroup2Name,
        groupType: GroupType.ReceivingGroup,
        captainId: captain1.id,
        ...commonGroupData,
      })
      daHubGroup = await Group.create({
        name: daHubGroupName,
        groupType: GroupType.DaHub,
        captainId: daCaptain.id,
        ...commonGroupData,
      })
      testServer = await makeTestServer({
        context: () => ({ auth: { ...fakeUserAuth, userAccount: captain1 } }),
      })
    })

    afterAll(purgeDb)

    describe('fetching individual groups', () => {
      const GROUP = gql`
        query ($id: Int!) {
          group(id: $id) {
            id
            name
          }
        }
      `
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
              variables: { id: sendingGroup1.id },
            })

            expect(res?.errors).toBeUndefined()
            expect(res?.data?.group.name).toBe(sendingGroup1.name)
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

            expect(res.errors[0].message).toBe('No group exists with ID 17')
          })
        })
      })
    })

    const toGroupData = ({ id, name, groupType }: Group) => ({
      id,
      name,
      groupType,
    })

    describe('listing groups', () => {
      it('lists existing groups', async () => {
        const res = await testServer.query({
          query: gql`
            query listGroups {
              listGroups {
                id
                name
                groupType
              }
            }
          `,
        })

        expect(res.errors).toBeUndefined()
        expect(res?.data?.listGroups).toIncludeSameMembers(
          [
            sendingGroup1,
            receivingGroup1,
            sendingGroup2,
            receivingGroup2,
            daHubGroup,
          ].map(toGroupData),
        )
      })

      describe('filtering', () => {
        it.each([
          [[GroupType.SendingGroup], [sendingGroup1Name, sendingGroup2Name]],
          [
            [GroupType.ReceivingGroup],
            [receivingGroup1Name, receivingGroup2Name],
          ],
          [[GroupType.DaHub], [daHubGroupName]],
          [
            [GroupType.SendingGroup, GroupType.ReceivingGroup],
            [
              sendingGroup1Name,
              sendingGroup2Name,
              receivingGroup1Name,
              receivingGroup2Name,
            ],
          ],
          [
            [GroupType.SendingGroup, GroupType.ReceivingGroup, GroupType.DaHub],
            [
              sendingGroup1Name,
              sendingGroup2Name,
              receivingGroup1Name,
              receivingGroup2Name,
              daHubGroupName,
            ],
          ],
        ])(
          'search for groups with type %s should yield %s',
          async (groupTypes, expectedGroupNames) => {
            const res = await testServer.query({
              query: gql`
                query listGroupsByType($groupType: [GroupType!]) {
                  listGroups(groupType: $groupType) {
                    id
                    name
                    groupType
                  }
                }
              `,
              variables: {
                groupType: groupTypes,
              },
            })
            expect(res.errors).toBeUndefined()
            expect(res?.data?.listGroups).toIncludeSameMembers(
              (await Group.findAll())
                .filter(({ name }) => expectedGroupNames.includes(name))
                .map(toGroupData),
            )
          },
        )

        it.each([
          [captain1Name, [sendingGroup1Name, receivingGroup2Name]],
          [captain2Name, [receivingGroup1Name, sendingGroup2Name]],
          [daCaptainName, [daHubGroupName]],
        ])(
          'search for groups with captain %s should yield %s',
          async (captainName, expectedGroupNames) => {
            const res = await testServer.query({
              query: gql`
                query listGroupsByCaptain($captainId: Int!) {
                  listGroups(captainId: $captainId) {
                    id
                    name
                    groupType
                  }
                }
              `,
              variables: {
                captainId: (
                  await UserAccount.findOne({
                    where: { auth0Id: captainName },
                  })
                )?.id,
              },
            })
            expect(res.errors).toBeUndefined()
            expect(res?.data?.listGroups).toIncludeSameMembers(
              (await Group.findAll())
                .filter(({ name }) => expectedGroupNames.includes(name))
                .map(toGroupData),
            )
          },
        )

        it.each([
          [[GroupType.SendingGroup], daCaptainName, []],
          [
            [GroupType.SendingGroup, GroupType.ReceivingGroup],
            captain1Name,
            [sendingGroup1Name, receivingGroup2Name],
          ],
        ])(
          `combining types %s and captain %s should yield %s`,
          async (groupTypes, captainName, expectedGroupNames) => {
            const res = await testServer.query({
              query: gql`
                query listGroupsByCaptainAndType(
                  $groupType: [GroupType!]
                  $captainId: Int!
                ) {
                  listGroups(groupType: $groupType, captainId: $captainId) {
                    id
                    name
                    groupType
                  }
                }
              `,
              variables: {
                captainId: (
                  await UserAccount.findOne({
                    where: { auth0Id: captainName },
                  })
                )?.id,
                groupType: groupTypes,
              },
            })
            expect(res.errors).toBeUndefined()
            expect(res?.data?.listGroups).toIncludeSameMembers(
              (
                await Group.findAll({
                  include: [{ association: 'captain' }],
                })
              )
                .filter(({ name }) => expectedGroupNames.includes(name))
                .filter(({ captain }) => captain.auth0Id === captainName)
                .map(toGroupData),
            )
          },
        )
      })
    })
  })
})
