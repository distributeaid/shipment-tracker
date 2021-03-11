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
  OfferUpdateInput,
  ShipmentStatus,
  ShippingRoute,
} from '../server-internal-types'
import { makeTestServer } from '../testServer'
import { createGroup, createShipment } from './helpers'
import UserAccount from '../models/user_account'
import { fakeUserAuth } from '../authenticateRequest'

const offerRepository = sequelize.getRepository(Offer)
const shipmentRepository = sequelize.getRepository(Shipment)
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

    it('fails validation if missing required inputs', async () => {
      let res = await captainTestServer.mutate({
        mutation: ADD_OFFER,
        variables: {
          input: {
            shipmentId: shipment.id,
            contact: { name: 'Savannah', email: 'test@example.com' },
            photoUris: ['one', 'two', 'three'],
          },
        },
      })

      expect(res.errors?.[0].message).toContain(
        'Field "sendingGroupId" of required type "Int!" was not provided.',
      )

      res = await captainTestServer.mutate({
        mutation: ADD_OFFER,
        variables: {
          input: {
            sendingGroupId: captainsGroup.id,
            contact: { name: 'Savannah', email: 'test@example.com' },
            photoUris: ['one', 'two', 'three'],
          },
        },
      })

      expect(res.errors?.[0].message).toContain(
        'Field "shipmentId" of required type "Int!" was not provided.',
      )
    })

    it('does not allow non-captains to create offers', async () => {
      const res = await otherUserTestServer.mutate<
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

      expect(res.errors?.[0].message).toContain(
        'not permitted to create offer for group',
      )
    })

    it('ensures the shipment exists', async () => {
      const res = await captainTestServer.mutate<
        { addOffer: Offer },
        { input: OfferCreateInput }
      >({
        mutation: ADD_OFFER,
        variables: {
          input: {
            sendingGroupId: captainsGroup.id,
            shipmentId: shipment.id + 1,
            contact: { name: 'Savannah', email: 'test@example.com' },
            photoUris: ['one', 'two', 'three'],
          },
        },
      })

      expect(res.errors?.[0].message).toContain(
        `Shipment ${shipment.id + 1} does not exist`,
      )
    })

    it('ensures the shipment is open', async () => {
      await shipmentRepository.update(
        { status: ShipmentStatus.InProgress },
        { where: { id: shipment.id } },
      )

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

      expect(res.errors?.[0].message).toContain(
        `Shipment ${shipment.id} is not accepting offers`,
      )
    })

    it('does not allow multiple offers for the same sending group and shipment', async () => {
      const doMutation = async () =>
        await captainTestServer.mutate<
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

      let res = await doMutation()

      expect(res.errors).toBeUndefined()

      res = await doMutation()

      expect(res.errors?.[0].message).toContain(
        `Shipment ${shipment.id} already has offer from group ${captainsGroup.id}`,
      )
    })
  })

  describe('updateOffer', () => {
    let offer: Offer

    const UPDATE_OFFER = gql`
      mutation($input: OfferUpdateInput!) {
        updateOffer(input: $input) {
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

    beforeEach(async () => {
      offer = await offerRepository.create({
        status: OfferStatus.Draft,
        statusChangeTime: new Date(),
        photoUris: [],
        shipmentId: shipment.id,
        sendingGroupId: captainsGroup.id,
      })
    })

    it.only('updates the provided attributes', async () => {
      const res = await captainTestServer.mutate<
        { updateOffer: Offer },
        { input: OfferUpdateInput }
      >({
        mutation: UPDATE_OFFER,
        variables: {
          input: {
            id: offer.id,
            status: OfferStatus.Proposed,
          },
        },
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.updateOffer?.id).toBeNumber()
      expect(res?.data?.updateOffer?.status).toEqual(OfferStatus.Proposed)
      expect(res?.data?.updateOffer?.shipmentId).toEqual(shipment.id)
      expect(res?.data?.updateOffer?.sendingGroupId).toEqual(captainsGroup.id)
    })
  })
})
