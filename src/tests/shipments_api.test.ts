import { ApolloServerTestClient } from 'apollo-server-testing'
import gql from 'graphql-tag'
import Group from '../models/group'
import Shipment from '../models/shipment'
import ShipmentExport from '../models/shipment_export'
import UserAccount from '../models/user_account'
import { sequelize } from '../sequelize'
import {
  GroupType,
  Shipment as GqlShipment,
  ShipmentCreateInput,
  ShipmentStatus,
  ShipmentUpdateInput,
  ShippingRoute,
} from '../server-internal-types'
import { makeAdminTestServer, makeTestServer } from '../testServer'
import { createGroup, createShipment } from './helpers'

describe('Shipments API', () => {
  let testServer: ApolloServerTestClient,
    adminTestServer: ApolloServerTestClient,
    group1: Group,
    group2: Group

  beforeEach(async () => {
    await sequelize.sync({ force: true })
    await Group.truncate({ cascade: true, force: true })
    await Shipment.truncate({ cascade: true, force: true })

    testServer = await makeTestServer()
    adminTestServer = await makeAdminTestServer()

    group1 = await createGroup({
      name: 'group 1',
      groupType: GroupType.DaHub,
      primaryLocation: { countryCode: 'UK', townCity: 'Bristol' },
      primaryContact: { name: 'Contact', email: 'contact@example.com' },
    })
    group2 = await createGroup({
      name: 'group 2',
      groupType: GroupType.ReceivingGroup,
      primaryLocation: { countryCode: 'FR', townCity: 'Bordeaux' },
      primaryContact: {
        name: 'Second Contact',
        email: '2ndcontact@example.com',
      },
    })
  })

  describe('addShipment', () => {
    const ADD_SHIPMENT = gql`
      mutation($input: ShipmentCreateInput!) {
        addShipment(input: $input) {
          id
          shippingRoute
          labelYear
          labelMonth
          sendingHubId
          receivingHubId
          status
        }
      }
    `

    it('forbids non-admin access', async () => {
      const res = await testServer.mutate<
        { addShipment: Shipment },
        { input: ShipmentCreateInput }
      >({
        mutation: ADD_SHIPMENT,
        variables: {
          input: {
            shippingRoute: ShippingRoute.Uk,
            labelYear: 2020,
            labelMonth: 1,
            sendingHubId: group1.id,
            receivingHubId: group2.id,
            status: ShipmentStatus.Open,
          },
        },
      })

      expect(res.errors).not.toBeUndefined()
      expect(res.errors).not.toBeEmpty()

      if (res.errors == null || res.errors.length === 0) {
        return
      }

      expect(res.errors[0].message).toEqual(
        'addShipment forbidden to non-admin users',
      )
    })

    it('adds a new shipment', async () => {
      const res = await adminTestServer.mutate<
        { addShipment: Shipment },
        { input: ShipmentCreateInput }
      >({
        mutation: ADD_SHIPMENT,
        variables: {
          input: {
            shippingRoute: ShippingRoute.Uk,
            labelYear: 2020,
            labelMonth: 1,
            sendingHubId: group1.id,
            receivingHubId: group2.id,
            status: ShipmentStatus.Open,
          },
        },
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.addShipment?.shippingRoute).toEqual(ShippingRoute.Uk)
      expect(res?.data?.addShipment?.labelYear).toEqual(2020)
      expect(res?.data?.addShipment?.labelMonth).toEqual(1)
      expect(res?.data?.addShipment?.sendingHubId).toEqual(group1.id)
      expect(res?.data?.addShipment?.receivingHubId).toEqual(group2.id)
    })
  })

  describe('updateShipment', () => {
    let shipment: Shipment

    const UPDATE_SHIPMENT = gql`
      mutation($id: Int!, $input: ShipmentUpdateInput!) {
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
        shippingRoute: ShippingRoute.Uk,
        labelYear: 2020,
        labelMonth: 1,
        sendingHubId: group1.id,
        receivingHubId: group2.id,
        status: ShipmentStatus.Open,
      })
    })

    it('forbids non-admin access', async () => {
      const res = await testServer.mutate<
        { updateShipment: Shipment },
        { id: number; input: ShipmentUpdateInput }
      >({
        mutation: UPDATE_SHIPMENT,
        variables: {
          id: shipment.id,
          input: {
            status: ShipmentStatus.Complete,
          },
        },
      })

      expect(res.errors).not.toBeUndefined()
      expect(res.errors).not.toBeEmpty()
      expect(res.errors?.[0]?.message).toBe(
        'updateShipment forbidden to non-admin users',
      )
    })

    describe('with a shipment that does not exist', () => {
      it('returns an error', async () => {
        const res = await adminTestServer.mutate<
          { updateShipment: Shipment },
          { id: number; input: ShipmentUpdateInput }
        >({
          mutation: UPDATE_SHIPMENT,
          variables: {
            id: 43,
            input: {
              status: ShipmentStatus.Complete,
            },
          },
        })

        expect(res.errors).not.toBeUndefined()
        expect(res.errors).not.toBeEmpty()
        expect(res.errors?.[0]?.message).toBe('No shipment exists with that ID')
      })
    })

    describe('with a sending hub that does not exist', () => {
      it('returns an error', async () => {
        const res = await adminTestServer.mutate<
          { updateShipment: Shipment },
          { id: number; input: ShipmentUpdateInput }
        >({
          mutation: UPDATE_SHIPMENT,
          variables: {
            id: shipment.id,
            input: {
              sendingHubId: 43,
            },
          },
        })

        expect(res.errors).not.toBeUndefined()
        expect(res.errors).not.toBeEmpty()
        expect(res.errors?.[0]?.message).toBe(
          'No sending group exists with that ID',
        )
      })
    })

    describe('with a receiving hub that does not exist', () => {
      it('returns an error', async () => {
        const res = await adminTestServer.mutate<
          { updateShipment: Shipment },
          { id: number; input: ShipmentUpdateInput }
        >({
          mutation: UPDATE_SHIPMENT,
          variables: {
            id: shipment.id,
            input: {
              receivingHubId: 43,
            },
          },
        })

        expect(res.errors).not.toBeUndefined()
        expect(res.errors).not.toBeEmpty()
        expect(res.errors?.[0]?.message).toBe(
          'No receiving group exists with that ID',
        )
      })
    })

    describe('with a valid parameter passed in', () => {
      it('updates the shipment', async () => {
        const res = await adminTestServer.mutate<
          { updateShipment: Shipment },
          { id: number; input: ShipmentUpdateInput }
        >({
          mutation: UPDATE_SHIPMENT,
          variables: {
            id: shipment.id,
            input: {
              status: ShipmentStatus.InProgress,
              pricing: {
                singlePallet: { currency: 'EUR', quantityInMinorUnits: 100 },
              },
            },
          },
        })

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
  })

  describe('listShipments', () => {
    it('lists existing shipments', async () => {
      const shipment1 = await createShipment({
        shippingRoute: ShippingRoute.Uk,
        labelYear: 2020,
        labelMonth: 1,
        sendingHubId: group1.id,
        receivingHubId: group2.id,
        status: ShipmentStatus.Open,
      })

      const shipment2 = await createShipment({
        shippingRoute: ShippingRoute.Uk,
        labelYear: 2021,
        labelMonth: 6,
        sendingHubId: group2.id,
        receivingHubId: group1.id,
        status: ShipmentStatus.InProgress,
      })

      const LIST_SHIPMENTS = gql`
        query listShipments {
          listShipments {
            id
            status
            sendingHub {
              id
              name
            }
            receivingHub {
              id
              name
            }
          }
        }
      `

      const res = await testServer.query<{ listShipments: Shipment[] }>({
        query: LIST_SHIPMENTS,
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.listShipments).toIncludeSameMembers([
        {
          id: shipment1.id,
          status: shipment1.status,
          sendingHub: {
            id: group1.id,
            name: group1.name,
          },
          receivingHub: {
            id: group2.id,
            name: group2.name,
          },
        },
        {
          id: shipment2.id,
          status: shipment2.status,
          sendingHub: {
            id: group2.id,
            name: group2.name,
          },
          receivingHub: {
            id: group1.id,
            name: group1.name,
          },
        },
      ])
    })
  })

  describe('shipment', () => {
    let shipment: Shipment, shipmentExport: ShipmentExport

    beforeEach(async () => {
      shipment = await createShipment({
        shippingRoute: ShippingRoute.Uk,
        labelYear: 2020,
        labelMonth: 1,
        sendingHubId: group1.id,
        receivingHubId: group2.id,
        status: ShipmentStatus.Open,
      })

      const user = await UserAccount.findOne()

      shipmentExport = await ShipmentExport.create({
        shipmentId: shipment.id,
        userAccountId: user!.id,
        contentsCsv: 'fake-contents',
      })
    })

    const SHIPMENT = gql`
      query($id: Int!) {
        shipment(id: $id) {
          shippingRoute
        }
      }
    `

    const SHIPMENT_WITH_EXPORTS = gql`
      query($id: Int!) {
        shipment(id: $id) {
          shippingRoute
          exports {
            id
            downloadPath
          }
        }
      }
    `

    describe('with no id', () => {
      it('returns an error', async () => {
        const res = await testServer.query({ query: SHIPMENT })

        expect(res.errors).not.toBeUndefined()
        expect(res.errors).not.toBeEmpty()

        expect(res.errors?.[0]?.message).toBe(
          'Variable "$id" of required type "Int!" was not provided.',
        )
      })
    })

    describe('with a parameter passed in', () => {
      describe('a valid id', () => {
        it('returns the correct group', async () => {
          const res = await testServer.query<{ shipment: Shipment }>({
            query: SHIPMENT,
            variables: { id: shipment.id },
          })

          expect(res.errors).toBeUndefined()
          expect(res.data?.shipment?.shippingRoute).toBe(shipment.shippingRoute)
        })

        it('returns exports when admins ask for them', async () => {
          const res = await adminTestServer.query<{ shipment: GqlShipment }>({
            query: SHIPMENT_WITH_EXPORTS,
            variables: { id: shipment.id },
          })

          expect(res.errors).toBeUndefined()

          const returnedExport = res.data?.shipment?.exports?.[0]!

          expect(returnedExport).not.toBeNil()
          expect(returnedExport.id).not.toBeNil()
          expect(returnedExport.downloadPath).not.toBeNil()
        })
      })

      describe('with an invalid id', () => {
        it('returns a nice error', async () => {
          const res = await testServer.query<{ shipment: Shipment }>({
            query: SHIPMENT,
            variables: { id: 17 },
          })

          expect(res.errors).not.toBeUndefined()
          expect(res.errors).not.toBeEmpty()
          expect(res.errors?.[0]?.message).toBe(
            'No shipment exists with that ID',
          )
        })
      })
    })
  })
})
