import gql from 'graphql-tag'
import { ApolloServerTestClient } from 'apollo-server-testing'

import Shipment from '../models/shipment'
import makeTestServer from '../testServer'
import { sequelize } from '../sequelize'
import {
  ShipmentInput,
  ShipmentStatus,
  ShippingRoute,
} from '../server-internal-types'
import { createGroup, createShipment } from './helpers'
import Group from '../models/group'

describe('Shipments API', () => {
  let testServer: ApolloServerTestClient

  beforeEach(async () => {
    testServer = makeTestServer()

    await sequelize.sync({ force: true })
    await sequelize
      .getRepository(Group)
      .truncate({ cascade: true, force: true })
    await sequelize
      .getRepository(Shipment)
      .truncate({ cascade: true, force: true })
  })

  describe('addShipment', () => {
    it('adds a new shipment', async () => {
      const group1 = await createGroup('group 1')
      const group2 = await createGroup('group 2')

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
      const group1 = await createGroup('group 1')
      const group2 = await createGroup('group 2')

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
