import { ApolloServer } from 'apollo-server-express'
import gql from 'graphql-tag'
import { omit } from 'lodash'
import { userToAuthContext } from '../authenticateRequest'
import Group, { GroupAttributes } from '../models/group'
import UserAccount from '../models/user_account'
import { sequelize } from '../sequelize'
import { GroupCreateInput, GroupType } from '../server-internal-types'
import { makeAdminTestServer, makeTestServer } from '../testServer'

const purgeDb = async () => sequelize.sync({ force: true })

const commonGroupData = {
  groupType: GroupType.Regular,
  primaryLocation: { countryCode: 'FR', townCity: 'Calais' },
  primaryContact: { name: 'Contact', email: 'contact@example.com' },
  website: 'http://www.example.com',
} as const

describe('Groups API', () => {
  describe('modifying', () => {
    const group1Name: string = 'group1'
    const group1Params = {
      name: group1Name,
      ...commonGroupData,
    }

    const group2Params = {
      name: 'group2',
      ...commonGroupData,
    }

    const daHub: GroupCreateInput = {
      ...commonGroupData,
      name: 'hub1',
      groupType: GroupType.DaHub,
    }

    let testServer: ApolloServer,
      adminTestServer: ApolloServer,
      captain: UserAccount,
      newCaptain: UserAccount

    beforeEach(async () => {
      await purgeDb()

      // Create test servers
      captain = await UserAccount.create({
        email: 'captain@example.com',
        passwordHash: '',
        name: 'Captain A',
      })
      newCaptain = await UserAccount.create({
        email: 'new-captain@example.com',
        passwordHash: '',
        name: 'New Captain',
      })
      testServer = await makeTestServer({
        context: () => ({ auth: userToAuthContext(captain) }),
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
        const res = await testServer.executeOperation({
          query: ADD_GROUP,
          variables: group1Params,
        })

        expect(res.errors).toBeUndefined()
        expect(res?.data?.addGroup?.name).toEqual(group1Name)
        expect(res?.data?.addGroup?.id).not.toBeNull()
      })

      it('prevents group captains from creating more than 1 group', async () => {
        await testServer.executeOperation({
          query: ADD_GROUP,
          variables: group1Params,
        })

        const res = await testServer.executeOperation({
          query: ADD_GROUP,
          variables: group2Params,
        })

        expect(res.errors).not.toBeUndefined()
        if (res.errors) {
          expect(res.errors[0].message).toBe(
            'Group captains can only create a single group',
          )
        }
      })

      it('allows admins to create DA hubs', async () => {
        const res = await adminTestServer.executeOperation({
          query: ADD_GROUP,
          variables: daHub,
        })

        expect(res.errors).toBeUndefined()
        expect(res?.data?.addGroup?.name).toEqual(daHub.name)
        expect(res?.data?.addGroup?.id).not.toBeNull()
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
          groupType: GroupType.DaHub,
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
        const res = await adminTestServer.executeOperation({
          query: UPDATE_GROUP,
          variables: {
            id: existingGroup.id,
            input: updateParams,
          },
        })

        expect(res.errors).toBeUndefined()
        expect(res.data?.updateGroup?.name).toEqual(updateParams.name)
        expect(res.data?.updateGroup?.groupType).toEqual(GroupType.DaHub)
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
        const res = await testServer.executeOperation({
          query: UPDATE_GROUP,
          variables: {
            id: existingGroup.id,
            input: omit(updateParams, 'groupType'),
          },
        })

        expect(res.errors).toBeUndefined()
        expect(res.data?.updateGroup?.name).toEqual(updateParams.name)
      })

      it('supports setting website to null', async () => {
        const res = await adminTestServer.executeOperation({
          query: UPDATE_GROUP,
          variables: {
            id: existingGroup.id,
            input: { ...updateParams, website: null },
          },
        })

        expect(res.errors).toBeUndefined()
        expect(res.data?.updateGroup?.website).toBeNull()
      })

      it('validates the website look like a URL', async () => {
        const res = await adminTestServer.executeOperation({
          query: UPDATE_GROUP,
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
        const res = await testServer.executeOperation({
          query: UPDATE_GROUP,
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
        ).executeOperation({
          query: UPDATE_GROUP,
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
    let testServer: ApolloServer
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
        email: `${captain1Name}@example.com`,
        name: captain1Name,
        passwordHash: '',
      })
      captain2 = await UserAccount.create({
        email: `${captain2Name}@example.com`,
        name: captain2Name,
        passwordHash: '',
      })
      daCaptain = await UserAccount.create({
        email: `${daCaptainName}@example.com`,
        name: daCaptainName,
        passwordHash: '',
      })
      sendingGroup1 = await Group.create({
        name: sendingGroup1Name,
        captainId: captain1.id,
        ...commonGroupData,
      })
      sendingGroup2 = await Group.create({
        name: sendingGroup2Name,
        captainId: captain2.id,
        ...commonGroupData,
      })
      receivingGroup1 = await Group.create({
        name: receivingGroup1Name,
        captainId: captain2.id,
        ...commonGroupData,
      })
      receivingGroup2 = await Group.create({
        name: receivingGroup2Name,
        captainId: captain1.id,
        ...commonGroupData,
      })
      daHubGroup = await Group.create({
        ...commonGroupData,
        name: daHubGroupName,
        groupType: GroupType.DaHub,
        captainId: daCaptain.id,
      })
      testServer = await makeTestServer({
        context: () => ({ auth: userToAuthContext(captain1) }),
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
          const res = await testServer.executeOperation({ query: GROUP })

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
            const res = await testServer.executeOperation({
              query: GROUP,
              variables: { id: sendingGroup1.id },
            })

            expect(res?.errors).toBeUndefined()
            expect(res?.data?.group.name).toBe(sendingGroup1.name)
          })
        })

        describe('with an invalid id', () => {
          it('returns a nice error', async () => {
            const res = await testServer.executeOperation({
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
        const res = await testServer.executeOperation({
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
          [
            [GroupType.Regular],
            [
              sendingGroup1Name,
              sendingGroup2Name,
              receivingGroup1Name,
              receivingGroup2Name,
            ],
          ],
          [[GroupType.DaHub], [daHubGroupName]],
          [
            [GroupType.Regular, GroupType.DaHub],
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
            const res = await testServer.executeOperation({
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
            const res = await testServer.executeOperation({
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
                  await UserAccount.findOneByEmail(`${captainName}@example.com`)
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
          [[GroupType.Regular], daCaptainName, []],
          [
            [GroupType.Regular],
            captain1Name,
            [sendingGroup1Name, receivingGroup2Name],
          ],
        ])(
          `combining types %s and captain %s should yield %s`,
          async (groupTypes, captainName, expectedGroupNames) => {
            const res = await testServer.executeOperation({
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
                  await UserAccount.findOneByEmail(`${captainName}@example.com`)
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
                .filter(
                  ({ captain }) =>
                    captain.email ===
                    `${captainName.toLowerCase()}@example.com`,
                )
                .map(toGroupData),
            )
          },
        )
      })
    })
  })
})
