import gql from 'graphql-tag'
import { ApolloServerTestClient } from 'apollo-server-testing'

import Shipment from '../models/shipment'
import { makeTestServer, makeAdminTestServer } from '../testServer'
import { sequelize } from '../sequelize'
import {
  GroupType,
  ShipmentInput,
  ShipmentStatus,
  ShippingRoute,
} from '../server-internal-types'
import { createGroup, createShipment } from './helpers'
import Group from '../models/group'

describe('Shipments API', () => {
  let testServer: ApolloServerTestClient,
    adminTestServer: ApolloServerTestClient,
    group1: Group,
    group2: Group

  beforeEach(async () => {
    await sequelize.sync({ force: true })
    await sequelize
      .getRepository(Group)
      .truncate({ cascade: true, force: true })
    await sequelize
      .getRepository(Shipment)
      .truncate({ cascade: true, force: true })

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
      mutation($input: ShipmentInput!) {
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
        { input: ShipmentInput }
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
        { input: ShipmentInput }
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
})
