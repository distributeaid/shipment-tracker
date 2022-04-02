import { ApolloServer } from 'apollo-server-express'
import gql from 'graphql-tag'
import Group from '../models/group'
import Shipment from '../models/shipment'
import ShipmentExport from '../models/shipment_export'
import UserAccount from '../models/user_account'
import { sequelize } from '../sequelize'
import {
  GroupType,
  Shipment as GqlShipment,
  ShipmentStatus,
} from '../server-internal-types'
import { makeAdminTestServer, makeTestServer } from '../testServer'
import { createGroup, createShipment, TypedGraphQLResponse } from './helpers'

describe('Shipments API', () => {
  let testServer: ApolloServer,
    adminTestServer: ApolloServer,
    group1: Group,
    group2: Group

  // Shipments cannot be created in the past, so we use the following year
  const nextYear = new Date().getFullYear() + 1

  beforeEach(async () => {
    await sequelize.sync({ force: true })
    await Group.truncate({ cascade: true, force: true })
    await Shipment.truncate({ cascade: true, force: true })

    testServer = await makeTestServer()
    adminTestServer = await makeAdminTestServer()

    group1 = await createGroup({
      name: 'group 1',
      groupType: GroupType.DaHub,
      country: 'GB',
      locality: 'Bristol',
      primaryContact: { name: 'Contact', email: 'contact@example.com' },
      servingRegions: [],
    })
    group2 = await createGroup({
      name: 'group 2',
      groupType: GroupType.Regular,
      country: 'FR',
      locality: 'Bordeaux',
      primaryContact: {
        name: 'Second Contact',
        email: '2ndcontact@example.com',
      },
      servingRegions: [],
    })
  })

  const ADD_SHIPMENT = gql`
    mutation ($input: ShipmentCreateInput!) {
      addShipment(input: $input) {
        id
        shipmentRoute {
          id
        }
        labelYear
        labelMonth
        sendingHubs {
          id
          name
        }
        receivingHubs {
          id
          name
        }
        status
      }
    }
  `

  describe('addShipment', () => {
    it('forbids non-admin access', async () => {
      const res = (await testServer.executeOperation({
        query: ADD_SHIPMENT,
        variables: {
          input: {
            shipmentRoute: 'UkToFr',
            labelYear: nextYear,
            labelMonth: 1,
            sendingHubs: [group1.id],
            receivingHubs: [group2.id],
            status: ShipmentStatus.Open,
          },
        },
      })) as TypedGraphQLResponse<{ addShipment: Shipment }>

      expect(res.errors).not.toBeUndefined()
      expect(res.errors).not.toHaveLength(0)

      if (res.errors == null || res.errors.length === 0) {
        return
      }

      expect(res.errors[0].message).toEqual(
        'addShipment forbidden to non-admin users',
      )
    })

    it('adds a new shipment', async () => {
      const res = (await adminTestServer.executeOperation({
        query: ADD_SHIPMENT,
        variables: {
          input: {
            shipmentRoute: 'UkToFr',
            labelYear: nextYear,
            labelMonth: 1,
            sendingHubs: [group1.id],
            receivingHubs: [group2.id],
            status: ShipmentStatus.Open,
          },
        },
      })) as TypedGraphQLResponse<{
        addShipment: GqlShipment
      }>

      expect(res.errors).toBeUndefined()
      expect(res?.data?.addShipment?.shipmentRoute.id).toEqual('UkToFr')
      expect(res?.data?.addShipment?.labelYear).toEqual(nextYear)
      expect(res?.data?.addShipment?.labelMonth).toEqual(1)
      expect(res?.data?.addShipment?.sendingHubs).toHaveLength(1)
      expect(res?.data?.addShipment?.sendingHubs[0]).toMatchObject({
        id: group1.id,
      })
      expect(res?.data?.addShipment?.receivingHubs).toHaveLength(1)
      expect(res?.data?.addShipment?.receivingHubs[0]).toMatchObject({
        id: group2.id,
      })
    })
  })

  describe('updateShipment', () => {
    let shipment: Shipment

    const UPDATE_SHIPMENT = gql`
      mutation ($id: Int!, $input: ShipmentUpdateInput!) {
        updateShipment(id: $id, input: $input) {
          id
          status
          statusChangeTime
          pricing {
            singlePallet {
              currency
              quantityInMinorUnits
            }
          }
        }
      }
    `

    beforeEach(async () => {
      shipment = await createShipment({
        shipmentRoute: 'UkToFr',
        labelYear: nextYear,
        labelMonth: 1,
        sendingHubs: [group1.id],
        receivingHubs: [group2.id],
        status: ShipmentStatus.Open,
      })
    })

    it('forbids non-admin access', async () => {
      const res = (await testServer.executeOperation({
        query: UPDATE_SHIPMENT,
        variables: {
          id: shipment.id,
          input: {
            status: ShipmentStatus.Complete,
          },
        },
      })) as TypedGraphQLResponse<{ updateShipment: Shipment }>

      expect(res.errors).not.toBeUndefined()
      expect(res.errors).not.toHaveLength(0)
      expect(res.errors?.[0]?.message).toBe(
        'updateShipment forbidden to non-admin users',
      )
    })

    describe('with a shipment that does not exist', () => {
      it('returns an error', async () => {
        const res = (await adminTestServer.executeOperation({
          query: UPDATE_SHIPMENT,
          variables: {
            id: 43,
            input: {
              status: ShipmentStatus.Complete,
            },
          },
        })) as TypedGraphQLResponse<{ updateShipment: Shipment }>

        expect(res.errors).not.toBeUndefined()
        expect(res.errors).not.toHaveLength(0)
        expect(res.errors?.[0]?.message).toBe(`No shipment exists with ID "43"`)
      })
    })

    describe('with a sending hub that does not exist', () => {
      it('returns an error', async () => {
        const res = (await adminTestServer.executeOperation({
          query: UPDATE_SHIPMENT,
          variables: {
            id: shipment.id,
            input: {
              sendingHubs: [43],
            },
          },
        })) as TypedGraphQLResponse<{ updateShipment: Shipment }>

        expect(res.errors).not.toBeUndefined()
        expect(res.errors).not.toHaveLength(0)
        expect(res.errors?.[0]?.message).toBe('Could not find sending hubs: 43')
      })
    })

    describe('with a receiving hub that does not exist', () => {
      it('returns an error', async () => {
        const res = (await adminTestServer.executeOperation({
          query: UPDATE_SHIPMENT,
          variables: {
            id: shipment.id,
            input: {
              receivingHubs: [43],
            },
          },
        })) as TypedGraphQLResponse<{ updateShipment: Shipment }>

        expect(res.errors).not.toBeUndefined()
        expect(res.errors).not.toHaveLength(0)
        expect(res.errors?.[0]?.message).toBe(
          'Could not find receiving hubs: 43',
        )
      })
    })

    describe('with a valid parameter passed in', () => {
      it('updates the shipment', async () => {
        const res = (await adminTestServer.executeOperation({
          query: UPDATE_SHIPMENT,
          variables: {
            id: shipment.id,
            input: {
              status: ShipmentStatus.InProgress,
              pricing: {
                singlePallet: { currency: 'EUR', quantityInMinorUnits: 100 },
              },
            },
          },
        })) as TypedGraphQLResponse<{ updateShipment: Shipment }>

        expect(res.errors).toBeUndefined()
        expect(res.data?.updateShipment?.id).toBe(shipment.id)
        expect(res.data?.updateShipment?.status).toBe(ShipmentStatus.InProgress)
        expect(res.data?.updateShipment?.statusChangeTime).not.toBe(
          shipment.statusChangeTime,
        )
        expect(
          res.data?.updateShipment?.pricing?.singlePallet?.currency,
        ).toEqual('EUR')
        expect(
          res.data?.updateShipment?.pricing?.singlePallet?.quantityInMinorUnits,
        ).toEqual(100)
      })
    })

    describe('update sending and receiving hubs', () => {
      let group3: Group, group4: Group, group5: Group
      let shipmentId: number

      beforeEach(async () => {
        group3 = await createGroup({
          name: 'group 3',
          groupType: GroupType.Regular,
          country: 'DE',
          locality: 'Berlin',
          primaryContact: {
            name: 'Third Contact',
            email: '3rdcontact@example.com',
          },
          servingRegions: [],
        })
        group4 = await createGroup({
          name: 'group 4',
          groupType: GroupType.Regular,
          country: 'SE',
          locality: 'Lund',
          primaryContact: {
            name: 'Fourth Contact',
            email: '4thcontact@example.com',
          },
          servingRegions: [],
        })
        group5 = await createGroup({
          name: 'group 5',
          groupType: GroupType.Regular,
          country: 'NO',
          locality: 'Trondheim',
          primaryContact: {
            name: 'Fifth Contact',
            email: '5thcontact@example.com',
          },
          servingRegions: [],
        })

        // Create the shipment with two sending and receiving groups
        shipmentId = (
          (await adminTestServer.executeOperation({
            query: ADD_SHIPMENT,
            variables: {
              input: {
                shipmentRoute: 'UkToFr',
                labelYear: nextYear,
                labelMonth: 1,
                sendingHubs: [group1.id, group2.id],
                receivingHubs: [group3.id, group4.id],
                status: ShipmentStatus.Open,
              },
            },
          })) as TypedGraphQLResponse<{ addShipment: Shipment }>
        ).data?.addShipment.id as number
      })

      it('does not allow to assign the same hubs', async () => {
        const res = await adminTestServer.executeOperation({
          query: UPDATE_SHIPMENT,
          variables: {
            id: shipmentId,
            input: {
              sendingHubs: [group3.id, group5.id],
              receivingHubs: [group3.id, group5.id],
            },
          },
        })
        expect(res.errors).not.toBeUndefined()
        expect(res.errors).not.toHaveLength(0)
        expect(res.errors?.[0]?.message).toMatch(
          /Sending and receiving hubs must be different/,
        )
      })

      it('does not allow to assign unknown hubs', async () => {
        const res = await adminTestServer.executeOperation({
          query: UPDATE_SHIPMENT,
          variables: {
            id: shipmentId,
            input: {
              sendingHubs: [group1.id, 42, 666],
              receivingHubs: [group3.id, group5.id],
            },
          },
        })
        expect(res.errors).not.toBeUndefined()
        expect(res.errors).not.toHaveLength(0)
        expect(res.errors?.[0]?.message).toMatch(
          /Could not find sending hubs: 42, 666/,
        )
      })

      it('updates the sending/receiving hubs', async () => {
        // Update the shipment hubs
        await adminTestServer.executeOperation({
          query: UPDATE_SHIPMENT,
          variables: {
            id: shipmentId,
            input: {
              sendingHubs: [group3.id, group5.id],
              receivingHubs: [group4.id, group1.id],
            },
          },
        })

        // Reload
        const updatedShipment = await Shipment.findByPk(shipmentId, {
          include: [
            {
              model: Group,
              as: 'sendingHubs',
            },
            {
              model: Group,
              as: 'receivingHubs',
            },
          ],
        })

        const sendingHubIds =
          updatedShipment?.sendingHubs.map(({ id }) => id) ?? []
        const receivingHubIds =
          updatedShipment?.receivingHubs.map(({ id }) => id) ?? []
        expect(sendingHubIds).toHaveLength(2)
        expect(receivingHubIds).toHaveLength(2)
        expect(sendingHubIds).toContain(group5.id)
        expect(sendingHubIds).toContain(group3.id)
        expect(receivingHubIds).toContain(group1.id)
        expect(receivingHubIds).toContain(group4.id)
      })
    })
  })

  describe('listShipments', () => {
    let shipment1: Shipment, shipment2: Shipment

    const LIST_SHIPMENTS = gql`
      query listShipments($status: [ShipmentStatus!]) {
        listShipments(status: $status) {
          id
          status
          sendingHubs {
            id
            name
          }
          receivingHubs {
            id
            name
          }
        }
      }
    `

    beforeEach(async () => {
      shipment1 = await createShipment({
        shipmentRoute: 'UkToFr',
        labelYear: nextYear,
        labelMonth: 1,
        sendingHubs: [group1.id],
        receivingHubs: [group2.id],
        status: ShipmentStatus.Open,
      })

      shipment2 = await createShipment({
        shipmentRoute: 'UkToFr',
        labelYear: nextYear + 1,
        labelMonth: 6,
        sendingHubs: [group2.id],
        receivingHubs: [],
        status: ShipmentStatus.InProgress,
      })
    })

    it('lists existing shipments', async () => {
      const res = (await testServer.executeOperation({
        query: LIST_SHIPMENTS,
      })) as TypedGraphQLResponse<{
        listShipments: Shipment[]
      }>

      expect(res.errors).toBeUndefined()
      expect(res?.data?.listShipments).toEqual(
        expect.arrayContaining([
          {
            id: shipment1.id,
            status: shipment1.status,
            sendingHubs: [
              {
                id: group1.id,
                name: group1.name,
              },
            ],
            receivingHubs: [
              {
                id: group2.id,
                name: group2.name,
              },
            ],
          },
          // Shipment 2 will be filtered out because of its status
        ]),
      )
    })

    it('filters shipments by status', async () => {
      const res = (await testServer.executeOperation({
        query: LIST_SHIPMENTS,
        variables: {
          status: [ShipmentStatus.Open],
        },
      })) as TypedGraphQLResponse<{
        listShipments: Shipment[]
      }>

      expect(res.errors).toBeUndefined()
      expect(res?.data?.listShipments).toEqual(
        expect.arrayContaining([
          {
            id: shipment1.id,
            status: shipment1.status,
            sendingHubs: [
              {
                id: group1.id,
                name: group1.name,
              },
            ],
            receivingHubs: [
              {
                id: group2.id,
                name: group2.name,
              },
            ],
          },
        ]),
      )
    })

    test('access denied error if filtering with denied shipment status as non-admin', async () => {
      const res = (await testServer.executeOperation({
        query: LIST_SHIPMENTS,
        variables: {
          status: [ShipmentStatus.InProgress],
        },
      })) as TypedGraphQLResponse<{ listShipments: Shipment[] }>

      expect(res.errors).not.toBeUndefined()
      expect(res.errors).not.toHaveLength(0)
      expect(res.errors?.[0]?.message).toBe(
        `non-admin users are not allowed to view shipments with status ${ShipmentStatus.InProgress}`,
      )
    })
  })

  describe('shipment', () => {
    let shipment: Shipment,
      adminOnlyShipment: Shipment,
      shipmentExport: ShipmentExport

    beforeEach(async () => {
      shipment = await createShipment({
        shipmentRoute: 'UkToFr',
        labelYear: nextYear,
        labelMonth: 1,
        sendingHubs: [group1.id],
        receivingHubs: [group2.id],
        status: ShipmentStatus.Open,
      })

      adminOnlyShipment = await createShipment({
        shipmentRoute: 'UkToFr',
        labelYear: nextYear,
        labelMonth: 1,
        sendingHubs: [group1.id],
        receivingHubs: [group2.id],
        status: ShipmentStatus.InProgress,
      })

      const user = await UserAccount.findOne()

      shipmentExport = await ShipmentExport.create({
        shipmentId: shipment.id,
        userAccountId: user!.id,
        contentsCsv: 'fake-contents',
      })
    })

    const SHIPMENT = gql`
      query ($id: Int!) {
        shipment(id: $id) {
          shipmentRoute {
            id
          }
        }
      }
    `

    const SHIPMENT_WITH_EXPORTS = gql`
      query ($id: Int!) {
        shipment(id: $id) {
          shipmentRoute {
            id
          }
          exports {
            id
            downloadPath
          }
        }
      }
    `

    describe('with no id', () => {
      it('returns an error', async () => {
        const res = await testServer.executeOperation({ query: SHIPMENT })

        expect(res.errors).not.toBeUndefined()
        expect(res.errors).not.toHaveLength(0)

        expect(res.errors?.[0]?.message).toBe(
          'Variable "$id" of required type "Int!" was not provided.',
        )
      })
    })

    describe('with a parameter passed in', () => {
      describe('a valid id', () => {
        it('returns the correct group', async () => {
          const res = (await testServer.executeOperation({
            query: SHIPMENT,
            variables: { id: shipment.id },
          })) as TypedGraphQLResponse<{ shipment: GqlShipment }>

          expect(res.errors).toBeUndefined()
          expect(res.data?.shipment?.shipmentRoute.id).toBe(
            shipment.shipmentRoute,
          )
        })

        it('returns exports when admins ask for them', async () => {
          const res = (await adminTestServer.executeOperation({
            query: SHIPMENT_WITH_EXPORTS,
            variables: { id: shipment.id },
          })) as TypedGraphQLResponse<{
            shipment: GqlShipment
          }>

          expect(res.errors).toBeUndefined()

          const returnedExport = res.data?.shipment?.exports?.[0]!

          expect(returnedExport == null).not.toBe(true)
          expect(returnedExport.id == null).not.toBe(true)
          expect(returnedExport.downloadPath == null).not.toBe(true)
        })
      })

      describe('with an invalid id', () => {
        it('returns a nice error', async () => {
          const res = (await testServer.executeOperation({
            query: SHIPMENT,
            variables: { id: 17 },
          })) as TypedGraphQLResponse<{ shipment: Shipment }>

          expect(res.errors).not.toBeUndefined()
          expect(res.errors).not.toHaveLength(0)
          expect(res.errors?.[0]?.message).toBe(
            'No shipment exists with ID "17"',
          )
        })
      })
    })
    test('access denied error if requesting shipment with denied shipment status as non-admin', async () => {
      const res = (await testServer.executeOperation({
        query: SHIPMENT,
        variables: { id: adminOnlyShipment.id },
      })) as TypedGraphQLResponse<{ shipment: Shipment }>

      expect(res.errors).not.toBeUndefined()
      expect(res.errors).not.toHaveLength(0)
      expect(res.errors?.[0]?.message).toBe(
        'non-admin users are not allowed to view shipments with status IN_PROGRESS',
      )
    })
  })
})
