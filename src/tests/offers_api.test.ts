import gql from 'graphql-tag'
import { ApolloServerTestClient } from 'apollo-server-testing'
import Group from '../models/group'
import Offer from '../models/offer'
import Shipment from '../models/shipment'
import { sequelize } from '../sequelize'
import {
  GroupType,
  OfferCreateInput,
  OfferStatus,
  ShipmentStatus,
  ShippingRoute,
} from '../server-internal-types'
import { makeTestServer } from '../testServer'
import { createGroup, createShipment } from './helpers'
import UserAccount from '../models/user_account'
import { fakeAdminAuth, fakeUserAuth } from '../authenticateRequest'

const userAccountRepository = sequelize.getRepository(UserAccount)

describe('Offers API', () => {
  let captainTestServer: ApolloServerTestClient,
    otherUserTestServer: ApolloServerTestClient,
    captain: UserAccount,
    captainsGroup: Group,
    group2: Group,
    shipment: Shipment

  beforeEach(async () => {
    await sequelize.sync({ force: true })
    await sequelize
      .getRepository(Offer)
      .truncate({ cascade: true, force: true })
    await sequelize
      .getRepository(Group)
      .truncate({ cascade: true, force: true })
    await sequelize
      .getRepository(Shipment)
      .truncate({ cascade: true, force: true })

    captain = await userAccountRepository.create({
      auth0Id: 'captain-id',
    })

    captainTestServer = await makeTestServer({
      context: () => ({ auth: { ...fakeUserAuth, userAccount: captain } }),
    })
    otherUserTestServer = await makeTestServer()

    captainsGroup = await createGroup(
      {
        name: 'group 1',
        groupType: GroupType.DaHub,
        primaryLocation: { countryCode: 'UK', townCity: 'Bristol' },
        primaryContact: { name: 'Contact', email: 'contact@example.com' },
      },
      captain.id,
    )

    group2 = await createGroup({
      name: 'group 2',
      groupType: GroupType.ReceivingGroup,
      primaryLocation: { countryCode: 'FR', townCity: 'Bordeaux' },
      primaryContact: {
        name: 'Second Contact',
        email: '2ndcontact@example.com',
      },
    })
    shipment = await createShipment({
      shippingRoute: ShippingRoute.Uk,
      labelYear: 2020,
      labelMonth: 1,
      sendingHubId: captainsGroup.id,
      receivingHubId: group2.id,
      status: ShipmentStatus.Open,
    })
  })

  describe('addOffer', () => {
    const ADD_OFFER = gql`
      mutation($input: OfferCreateInput!) {
        addOffer(input: $input) {
          id
          status
          contact {
            name
            email
            signal
          }
          photoUris
          shipmentId
          sendingGroupId
        }
      }
    `

    it('creates a new offer', async () => {
      const res = await captainTestServer.mutate<
        { addOffer: Offer },
        { input: OfferCreateInput }
      >({
        mutation: ADD_OFFER,
        variables: {
          input: {
            sendingGroupId: captainsGroup.id,
            shipmentId: shipment.id,
            contact: { name: 'Savannah', email: 'test@example.com' },
            photoUris: ['one', 'two', 'three'],
          },
        },
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.addOffer?.id).toBeNumber()
      expect(res?.data?.addOffer?.status).toEqual(OfferStatus.Draft)
      expect(res?.data?.addOffer?.contact?.name).toEqual('Savannah')
      expect(res?.data?.addOffer?.contact?.email).toEqual('test@example.com')
      expect(res?.data?.addOffer?.contact?.signal).toBeNull
      expect(res?.data?.addOffer?.photoUris).toContain('one')
      expect(res?.data?.addOffer?.photoUris).toContain('two')
      expect(res?.data?.addOffer?.photoUris).toContain('three')
      expect(res?.data?.addOffer?.shipmentId).toEqual(shipment.id)
      expect(res?.data?.addOffer?.sendingGroupId).toEqual(captainsGroup.id)
    })
  })
})
