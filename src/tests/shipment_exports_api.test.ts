import { ApolloServer } from 'apollo-server-express'
import gql from 'graphql-tag'
import Group from '../models/group'
import LineItem from '../models/line_item'
import Offer from '../models/offer'
import Pallet from '../models/pallet'
import Shipment from '../models/shipment'
import ShipmentExport from '../models/shipment_export'
import UserAccount from '../models/user_account'
import { HEADER_ROW } from '../resolvers/shipment_exports'
import { sequelize } from '../sequelize'
import {
  GroupType,
  LineItemCategory,
  LineItemContainerType,
  LineItemStatus,
  OfferStatus,
  PalletType,
  PaymentStatus,
  ShipmentExport as WireShipmentExport,
  ShipmentStatus,
} from '../server-internal-types'
import { makeAdminTestServerWithServices, TestServices } from '../testServer'
import { TypedGraphQLResponse } from './helpers'

describe('ShipmentExports API', () => {
  let adminTestServer: ApolloServer,
    shipment: Shipment,
    captain: UserAccount,
    hub1: Group,
    hub2: Group,
    group1: Group,
    group2: Group,
    offer: Offer,
    pallet: Pallet,
    lineItem: LineItem,
    services: TestServices

  beforeEach(async () => {
    await sequelize.sync({ force: true })

    captain = await UserAccount.create({
      email: 'captain@example.com',
      passwordHash: '',
      name: 'Captain',
    })

    const serverWithContext = await makeAdminTestServerWithServices()
    adminTestServer = serverWithContext.testServer
    services = serverWithContext.services

    hub1 = await Group.create({
      name: 'hub 1',
      groupType: GroupType.DaHub,
      country: 'GB',
      locality: 'Bristol',
      primaryContact: { name: 'Contact', email: 'contact@example.com' },
      captainId: captain.id,
      servingRegions: [],
    })

    hub2 = await Group.create({
      name: 'hub 2',
      groupType: GroupType.DaHub,
      country: 'FR',
      locality: 'Calais',
      primaryContact: { name: 'Contact', email: 'contact@example.com' },
      captainId: captain.id,
      servingRegions: [],
    })

    group1 = await Group.create({
      name: 'group 1',
      groupType: GroupType.Regular,
      country: 'GB',
      locality: 'Bristol',
      primaryContact: { name: 'Contact', email: 'contact@example.com' },
      captainId: captain.id,
      servingRegions: [],
    })

    group2 = await Group.create({
      name: 'group 2',
      groupType: GroupType.Regular,
      country: 'FR',
      locality: 'Calais',
      primaryContact: { name: 'Contact', email: 'contact@example.com' },
      captainId: captain.id,
      servingRegions: [],
    })

    shipment = await Shipment.create({
      origin: 'uk',
      destination: 'greece',
      labelYear: 2020,
      labelMonth: 1,
      sendingHubs: [hub1],
      receivingHubs: [hub2],
      receivingGroups: [group1],
      status: ShipmentStatus.Open,
    })

    offer = await Offer.create({
      shipmentId: shipment.id,
      sendingGroupId: group1.id,
      status: OfferStatus.Draft,
      photoUris: [],
      contact: {
        name: 'offer contact name',
        email: 'test@email.com',
        whatsApp: 'whatsapp',
      },
    })

    pallet = await Pallet.create({
      offerId: offer.id,
      palletCount: 1,
      palletType: PalletType.Standard,
      paymentStatus: PaymentStatus.Uninitiated,
      paymentStatusChangeTime: new Date(),
    })

    lineItem = await LineItem.create({
      offerPalletId: pallet.id,
      status: LineItemStatus.Proposed,
      containerType: LineItemContainerType.Unset,
      category: LineItemCategory.Unset,
      itemCount: 0,
      affirmLiability: false,
      tosAccepted: false,
      dangerousGoods: [],
      photoUris: [],
      statusChangeTime: new Date(),
    })

    await lineItem.update({
      acceptedReceivingGroupId: group2.id,
      description: 'description',
      containerCount: 5,
      sendingHubDeliveryDate: new Date(),
    })
  })

  describe('exportShipment', () => {
    const LIST_SHIPMENT_EXPORTS = gql`
      query ($shipmentId: Int!) {
        listShipmentExports(shipmentId: $shipmentId) {
          id
          shipmentId
          downloadPath
          createdBy {
            id
          }
          createdAt
        }
      }
    `

    const EXPORT_SHIPMENT = gql`
      mutation ($shipmentId: Int!) {
        exportShipment(shipmentId: $shipmentId) {
          id
          shipmentId
          downloadPath
          createdBy {
            id
          }
          createdAt
        }
      }
    `

    it('exports to CSV and creates a record of the export, lists it', async () => {
      const res = (await adminTestServer.executeOperation({
        query: EXPORT_SHIPMENT,
        variables: {
          shipmentId: shipment.id,
        },
      })) as TypedGraphQLResponse<{ exportShipment: ShipmentExport }>

      expect(res.errors).toBeUndefined()

      expect(services.generateCsvCalls[0]).toEqual({
        rows: [
          HEADER_ROW,
          [
            'group 1', // 'Sending group',
            'offer contact name', // 'Contact name',
            'test@email.com', // 'Contact email',
            'whatsapp', // 'Contact WhatsApp',
            'group 2 (accepted)', // 'Receiving group',
            'UNSET', // 'Category of aid',
            'description', // 'Item description',
            1, // 'Pallet ID',
            5, //  'Container count',
            0, // 'Pallet weight (kg)',
            'None', // Dangerous items',
            expect.stringMatching(/^\d\d\d\d-\d\d-\d\d$/), // 'Sending hub delivery date',
          ],
        ],
      })

      const listRes = (await adminTestServer.executeOperation({
        query: LIST_SHIPMENT_EXPORTS,
        variables: {
          shipmentId: shipment.id,
        },
      })) as TypedGraphQLResponse<{ listShipmentExports: WireShipmentExport[] }>

      expect(listRes.errors).toBeUndefined()

      const export1 = listRes.data?.listShipmentExports?.[0]!

      expect(export1.shipmentId).toEqual(shipment.id)
    })
  })
})
