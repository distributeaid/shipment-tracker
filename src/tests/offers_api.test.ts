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
import { makeAdminTestServer, makeTestServer } from '../testServer'
import { createGroup, createShipment } from './helpers'
import UserAccount from '../models/user_account'
import { fakeUserAuth } from '../authenticateRequest'

describe('Offers API', () => {
  let captainTestServer: ApolloServerTestClient,
    otherUserTestServer: ApolloServerTestClient,
    adminTestServer: ApolloServerTestClient,
    captain: UserAccount,
    captainsGroup: Group,
    group2: Group,
    shipment: Shipment,
    offer: Offer

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

    captain = await UserAccount.create({
      auth0Id: 'captain-id',
    })

    captainTestServer = await makeTestServer({
      context: () => ({ auth: { ...fakeUserAuth, userAccount: captain } }),
    })
    otherUserTestServer = await makeTestServer()
    adminTestServer = await makeAdminTestServer()

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
      await Shipment.update(
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
      offer = await Offer.create({
        status: OfferStatus.Draft,
        statusChangeTime: new Date(),
        photoUris: [],
        shipmentId: shipment.id,
        sendingGroupId: captainsGroup.id,
      })
    })

    it('updates the provided attributes', async () => {
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

    it('restricts access', async () => {
      const res = await otherUserTestServer.mutate<
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

      expect(res.errors?.[0].message).toEqual('Not permitted to update offer')
    })
  })

  describe('listOffers', () => {
    let otherOfferInShipment: Offer,
      otherShipment: Shipment,
      otherShipmentOffer: Offer

    const LIST_OFFERS_QUERY = gql`
      query($shipmentId: Int!) {
        listOffers(shipmentId: $shipmentId) {
          id
          status
          shipmentId
          sendingGroupId
          photoUris
          contact {
            name
            email
            signal
          }
        }
      }
    `

    beforeEach(async () => {
      otherShipment = await createShipment({
        labelYear: 2021,
        labelMonth: 1,
        shippingRoute: ShippingRoute.Uk,
        sendingHubId: captainsGroup.id,
        receivingHubId: captainsGroup.id,
        status: ShipmentStatus.Open,
      })

      otherOfferInShipment = await Offer.create({
        status: OfferStatus.Draft,
        statusChangeTime: new Date(),
        photoUris: [],
        shipmentId: shipment.id,
        sendingGroupId: group2.id,
      })

      otherShipmentOffer = await Offer.create({
        status: OfferStatus.Draft,
        statusChangeTime: new Date(),
        photoUris: [],
        shipmentId: otherShipment.id,
        sendingGroupId: captainsGroup.id,
      })

      offer = await Offer.create({
        status: OfferStatus.Draft,
        statusChangeTime: new Date(),
        photoUris: [],
        shipmentId: shipment.id,
        sendingGroupId: captainsGroup.id,
      })
    })

    it('returns the offers for the group the user is captain of', async () => {
      const res = await captainTestServer.query({
        query: LIST_OFFERS_QUERY,
        variables: { shipmentId: shipment.id },
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.listOffers?.length).toEqual(1)

      const foundOffer = res.data?.listOffers?.[0]

      expect(foundOffer.id).toEqual(offer.id)
    })

    it('admins get all offers for the shipment', async () => {
      const res = await adminTestServer.query({
        query: LIST_OFFERS_QUERY,
        variables: { shipmentId: shipment.id },
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.listOffers?.length).toEqual(2)

      const ids = res.data?.listOffers?.map((offer: Offer) => offer.id)
      expect(ids.sort()).toEqual([offer.id, otherOfferInShipment.id].sort())
    })

    it('returns empty if user has no authorized offers for shipment', async () => {
      const res = await otherUserTestServer.query({
        query: LIST_OFFERS_QUERY,
        variables: { shipmentId: shipment.id },
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.listOffers?.length).toEqual(0)
    })
  })

  describe('offer', () => {
    const OFFER_QUERY = gql`
      query($id: Int!) {
        offer(id: $id) {
          id
          status
          shipmentId
          sendingGroupId
          photoUris
          contact {
            name
            email
            signal
          }
        }
      }
    `

    beforeEach(async () => {
      offer = await Offer.create({
        status: OfferStatus.Draft,
        statusChangeTime: new Date(),
        photoUris: [],
        shipmentId: shipment.id,
        sendingGroupId: captainsGroup.id,
      })
    })

    it('returns the offer for captain', async () => {
      const res = await captainTestServer.query({
        query: OFFER_QUERY,
        variables: { id: offer.id },
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.offer?.id).toBeNumber()
      expect(res?.data?.offer?.status).toEqual(OfferStatus.Draft)
      expect(res?.data?.offer?.shipmentId).toEqual(shipment.id)
      expect(res?.data?.offer?.sendingGroupId).toEqual(captainsGroup.id)
    })

    it('returns the offer for admins', async () => {
      const res = await adminTestServer.query({
        query: OFFER_QUERY,
        variables: { id: offer.id },
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.offer?.id).toBeNumber()
      expect(res?.data?.offer?.status).toEqual(OfferStatus.Draft)
      expect(res?.data?.offer?.shipmentId).toEqual(shipment.id)
      expect(res?.data?.offer?.sendingGroupId).toEqual(captainsGroup.id)
    })

    it('forbids other users', async () => {
      const res = await otherUserTestServer.query({
        query: OFFER_QUERY,
        variables: { id: offer.id },
      })

      expect(res.errors?.[0].message).toEqual(
        'Not permitted to view that offer',
      )
    })
  })
})
