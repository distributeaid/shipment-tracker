import { ApolloServerTestClient } from 'apollo-server-testing'
import gql from 'graphql-tag'
import { fakeUserAuth } from '../authenticateRequest'
import Group from '../models/group'
import LineItem from '../models/line_item'
import Offer from '../models/offer'
import Pallet from '../models/pallet'
import Shipment from '../models/shipment'
import UserAccount from '../models/user_account'
import { sequelize } from '../sequelize'
import {
  GroupType,
  LineItemCategory,
  LineItemContainerType,
  LineItemStatus,
  OfferStatus,
  PalletCreateInput,
  PalletType,
  PalletUpdateInput,
  PaymentStatus,
  ShipmentStatus,
  ShippingRoute,
} from '../server-internal-types'
import { makeAdminTestServer, makeTestServer } from '../testServer'

describe('Pallets API', () => {
  let adminTestServer: ApolloServerTestClient,
    captainTestServer: ApolloServerTestClient,
    otherUserTestServer: ApolloServerTestClient,
    shipment: Shipment,
    group: Group,
    offer: Offer,
    captain: UserAccount

  beforeEach(async () => {
    await sequelize.sync({ force: true })
    await UserAccount.truncate({ cascade: true, force: true })
    await Offer.truncate({ cascade: true, force: true })
    await Group.truncate({ cascade: true, force: true })
    await Shipment.truncate({ cascade: true, force: true })
    await Pallet.truncate({ cascade: true, force: true })

    captain = await UserAccount.create({
      auth0Id: 'captain-id',
    })

    captainTestServer = await makeTestServer({
      context: () => ({ auth: { ...fakeUserAuth, userAccount: captain } }),
    })
    adminTestServer = await makeAdminTestServer()
    otherUserTestServer = await makeTestServer()

    group = await Group.create({
      name: 'group 1',
      groupType: GroupType.DaHub,
      primaryLocation: { countryCode: 'GB', townCity: 'Bristol' },
      primaryContact: { name: 'Contact', email: 'contact@example.com' },
      captainId: captain.id,
    })

    shipment = await Shipment.create({
      shippingRoute: ShippingRoute.UkToCs,
      labelYear: 2020,
      labelMonth: 1,
      sendingHubId: group.id,
      receivingHubId: group.id,
      status: ShipmentStatus.Open,
    })

    offer = await Offer.create({
      shipmentId: shipment.id,
      sendingGroupId: group.id,
      status: OfferStatus.Draft,
      photoUris: [],
    })
  })

  describe('addPallet', () => {
    const ADD_PALLET = gql`
      mutation($input: PalletCreateInput!) {
        addPallet(input: $input) {
          offerId
          palletType
          paymentStatus
        }
      }
    `

    it('creates a new pallet', async () => {
      const res = await captainTestServer.mutate<
        { addPallet: Pallet },
        { input: PalletCreateInput }
      >({
        mutation: ADD_PALLET,
        variables: {
          input: {
            offerId: offer.id,
            palletType: PalletType.Standard,
          },
        },
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.addPallet?.offerId).toEqual(offer.id)
      expect(res?.data?.addPallet?.palletType).toEqual(PalletType.Standard)
      expect(res?.data?.addPallet?.paymentStatus).toEqual(
        PaymentStatus.Uninitiated,
      )
    })

    it('forbids anyone not a captain of the associated group or admin', async () => {
      const res = await otherUserTestServer.mutate<
        { addPallet: Pallet },
        { input: PalletCreateInput }
      >({
        mutation: ADD_PALLET,
        variables: {
          input: {
            offerId: offer.id,
            palletType: PalletType.Standard,
          },
        },
      })

      expect(res.errors?.[0].message).toEqual('Forbidden to access this offer')
    })

    it('is forbidden for the captain when the offer is not in draft', async () => {
      await offer.update({ status: OfferStatus.BeingReviewed })

      const res = await captainTestServer.mutate<
        { addPallet: Pallet },
        { input: PalletCreateInput }
      >({
        mutation: ADD_PALLET,
        variables: {
          input: {
            offerId: offer.id,
            palletType: PalletType.Standard,
          },
        },
      })

      expect(res.errors?.[0].message).toEqual(
        'Cannot modify pallets for offer not in draft state',
      )
    })

    it('is forbidden for the captain when the shipment is not open', async () => {
      await shipment.update({ status: ShipmentStatus.Staging })

      const res = await captainTestServer.mutate<
        { addPallet: Pallet },
        { input: PalletCreateInput }
      >({
        mutation: ADD_PALLET,
        variables: {
          input: {
            offerId: offer.id,
            palletType: PalletType.Standard,
          },
        },
      })

      expect(res.errors?.[0].message).toEqual(
        'Cannot modify pallets when the shipment is not open',
      )
    })

    it('an admin can create the pallets when the shipment is not open', async () => {
      await shipment.update({ status: ShipmentStatus.Staging })

      const res = await adminTestServer.mutate<
        { addPallet: Pallet },
        { input: PalletCreateInput }
      >({
        mutation: ADD_PALLET,
        variables: {
          input: {
            offerId: offer.id,
            palletType: PalletType.Standard,
          },
        },
      })

      expect(res.errors).toBeUndefined()
      expect(res?.data?.addPallet).not.toBeNil()
    })
  })

  describe('updatePallet', () => {
    let pallet: Pallet

    const UPDATE_PALLET = gql`
      mutation($id: Int!, $input: PalletUpdateInput!) {
        updatePallet(id: $id, input: $input) {
          palletType
          paymentStatus
        }
      }
    `

    beforeEach(async () => {
      pallet = await Pallet.create({
        offerId: offer.id,
        palletType: PalletType.Standard,
        paymentStatus: PaymentStatus.Uninitiated,
        paymentStatusChangeTime: new Date(),
      })
    })

    it('updates the existing pallet', async () => {
      const res = await captainTestServer.mutate<
        { updatePallet: Pallet },
        { id: number; input: PalletUpdateInput }
      >({
        mutation: UPDATE_PALLET,
        variables: {
          id: pallet.id,
          input: {
            paymentStatus: PaymentStatus.Paid,
            palletType: PalletType.Euro,
          },
        },
      })

      expect(res.errors).toBeUndefined()
    })
  })

  describe('pallet', () => {
    let pallet: Pallet, lineItem: LineItem

    const GET_PALLET = gql`
      query($id: Int!) {
        pallet(id: $id) {
          id
          lineItems {
            id
          }
        }
      }
    `

    beforeEach(async () => {
      pallet = await Pallet.create({
        offerId: offer.id,
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
    })

    it('updates the existing pallet', async () => {
      const res = await captainTestServer.mutate<
        { pallet: Pallet },
        { id: number }
      >({
        mutation: GET_PALLET,
        variables: {
          id: pallet.id,
        },
      })

      expect(res.errors).toBeUndefined()
      expect(res.data?.pallet?.id).toEqual(pallet.id)
      expect(res.data?.pallet?.lineItems?.[0]?.id).toEqual(lineItem.id)
    })
  })

  describe('destroyPallet', () => {
    let palletA: Pallet, palletB: Pallet

    const DESTROY_PALLET = gql`
      mutation($id: Int!) {
        destroyPallet(id: $id) {
          id
          pallets {
            id
          }
        }
      }
    `

    beforeEach(async () => {
      palletA = await Pallet.create({
        offerId: offer.id,
        palletType: PalletType.Standard,
        paymentStatus: PaymentStatus.Uninitiated,
        paymentStatusChangeTime: new Date(),
      })

      palletB = await Pallet.create({
        offerId: offer.id,
        palletType: PalletType.Standard,
        paymentStatus: PaymentStatus.Uninitiated,
        paymentStatusChangeTime: new Date(),
      })
    })

    it('destroys the pallet', async () => {
      const res = await captainTestServer.mutate<
        { destroyPallet: Offer },
        { id: number }
      >({
        mutation: DESTROY_PALLET,
        variables: { id: palletA.id },
      })

      expect(res.errors).toBeUndefined()
      expect(await Pallet.findByPk(palletA.id)).toBeNull()
      expect(res.data?.destroyPallet?.pallets?.[0].id).toEqual(palletB.id)
    })
  })
})
