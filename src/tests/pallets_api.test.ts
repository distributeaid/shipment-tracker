import { ApolloServer } from 'apollo-server-express'
import gql from 'graphql-tag'
import { userToAuthContext } from '../authenticateRequest'
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
  PalletType,
  PaymentStatus,
  ShipmentStatus,
} from '../server-internal-types'
import { makeAdminTestServer, makeTestServer } from '../testServer'
import { TypedGraphQLResponse } from './helpers'

describe('Pallets API', () => {
  let adminTestServer: ApolloServer,
    captainTestServer: ApolloServer,
    otherUserTestServer: ApolloServer,
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
      email: 'captain@example.com',
      passwordHash: '',
      name: 'Captain',
    })

    captainTestServer = await makeTestServer({
      context: () => ({ auth: userToAuthContext(captain) }),
    })
    adminTestServer = await makeAdminTestServer()
    otherUserTestServer = await makeTestServer()

    group = await Group.create({
      name: 'group 1',
      groupType: GroupType.DaHub,
      primaryLocation: { country: 'GB', city: 'Bristol' },
      primaryContact: { name: 'Contact', email: 'contact@example.com' },
      captainId: captain.id,
      termsAndConditionsAcceptedAt: new Date(),
    })

    shipment = await Shipment.create({
      shipmentRoute: 'UkToCs',
      labelYear: 2020,
      labelMonth: 1,
      sendingHubs: [group],
      receivingHubs: [group],
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
      mutation ($input: PalletCreateInput!) {
        addPallet(input: $input) {
          offerId
          palletType
          paymentStatus
        }
      }
    `

    it('creates a new pallet', async () => {
      const res = (await captainTestServer.executeOperation({
        query: ADD_PALLET,
        variables: {
          input: {
            offerId: offer.id,
            palletType: PalletType.Standard,
          },
        },
      })) as TypedGraphQLResponse<{ addPallet: Pallet }>

      expect(res.errors).toBeUndefined()
      expect(res?.data?.addPallet?.offerId).toEqual(offer.id)
      expect(res?.data?.addPallet?.palletType).toEqual(PalletType.Standard)
      expect(res?.data?.addPallet?.paymentStatus).toEqual(
        PaymentStatus.Uninitiated,
      )
    })

    it('forbids anyone not a captain of the associated group or admin', async () => {
      const res = (await otherUserTestServer.executeOperation({
        query: ADD_PALLET,
        variables: {
          input: {
            offerId: offer.id,
            palletType: PalletType.Standard,
          },
        },
      })) as TypedGraphQLResponse<{ addPallet: Pallet }>

      expect(res.errors?.[0].message).toEqual('Forbidden to access this offer')
    })

    it('is forbidden for the captain when the offer is not in draft', async () => {
      await offer.update({ status: OfferStatus.BeingReviewed })

      const res = (await captainTestServer.executeOperation({
        query: ADD_PALLET,
        variables: {
          input: {
            offerId: offer.id,
            palletType: PalletType.Standard,
          },
        },
      })) as TypedGraphQLResponse<{ addPallet: Pallet }>

      expect(res.errors?.[0].message).toEqual(
        'Cannot modify pallets for offer not in draft state',
      )
    })

    it('is forbidden for the captain when the shipment is not open', async () => {
      await shipment.update({ status: ShipmentStatus.Staging })

      const res = (await captainTestServer.executeOperation({
        query: ADD_PALLET,
        variables: {
          input: {
            offerId: offer.id,
            palletType: PalletType.Standard,
          },
        },
      })) as TypedGraphQLResponse<{ addPallet: Pallet }>

      expect(res.errors?.[0].message).toEqual(
        'Cannot modify pallets when the shipment is not open',
      )
    })

    it('an admin can create the pallets when the shipment is not open', async () => {
      await shipment.update({ status: ShipmentStatus.Staging })

      const res = (await adminTestServer.executeOperation({
        query: ADD_PALLET,
        variables: {
          input: {
            offerId: offer.id,
            palletType: PalletType.Standard,
          },
        },
      })) as TypedGraphQLResponse<{ addPallet: Pallet }>

      expect(res.errors).toBeUndefined()
      expect(res?.data?.addPallet == null).not.toBe(true)
    })
  })

  describe('updatePallet', () => {
    let pallet: Pallet

    const UPDATE_PALLET = gql`
      mutation ($id: Int!, $input: PalletUpdateInput!) {
        updatePallet(id: $id, input: $input) {
          palletType
          paymentStatus
        }
      }
    `

    beforeEach(async () => {
      pallet = await Pallet.create({
        offerId: offer.id,
        palletCount: 1,
        palletType: PalletType.Standard,
        paymentStatus: PaymentStatus.Uninitiated,
        paymentStatusChangeTime: new Date(),
      })
    })

    it('updates the existing pallet', async () => {
      const res = (await captainTestServer.executeOperation({
        query: UPDATE_PALLET,
        variables: {
          id: pallet.id,
          input: {
            paymentStatus: PaymentStatus.Paid,
            palletType: PalletType.Euro,
          },
        },
      })) as TypedGraphQLResponse<{ updatePallet: Pallet }>

      expect(res.errors).toBeUndefined()
    })
  })

  describe('pallet', () => {
    let pallet: Pallet, lineItem: LineItem

    const GET_PALLET = gql`
      query ($id: Int!) {
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
    })

    it('updates the existing pallet', async () => {
      const res = (await captainTestServer.executeOperation({
        query: GET_PALLET,
        variables: {
          id: pallet.id,
        },
      })) as TypedGraphQLResponse<{ pallet: Pallet }>

      expect(res.errors).toBeUndefined()
      expect(res.data?.pallet?.id).toEqual(pallet.id)
      expect(res.data?.pallet?.lineItems?.[0]?.id).toEqual(lineItem.id)
    })
  })

  describe('destroyPallet', () => {
    let palletA: Pallet, palletB: Pallet
    let lineItem: LineItem

    const DESTROY_PALLET = gql`
      mutation ($id: Int!) {
        destroyPallet(id: $id)
      }
    `

    beforeEach(async () => {
      palletA = await Pallet.create({
        offerId: offer.id,
        palletCount: 1,
        palletType: PalletType.Standard,
        paymentStatus: PaymentStatus.Uninitiated,
        paymentStatusChangeTime: new Date(),
      })

      palletB = await Pallet.create({
        offerId: offer.id,
        palletCount: 1,
        palletType: PalletType.Standard,
        paymentStatus: PaymentStatus.Uninitiated,
        paymentStatusChangeTime: new Date(),
      })

      lineItem = await LineItem.create({
        status: LineItemStatus.Proposed,
        affirmLiability: true,
        category: LineItemCategory.Clothing,
        containerType: LineItemContainerType.Box,
        dangerousGoods: [],
        itemCount: 10,
        offerPalletId: palletA.id,
        photoUris: [],
        statusChangeTime: new Date(),
        tosAccepted: true,
      })
    })

    it('destroys the pallet', async () => {
      const res = (await captainTestServer.executeOperation({
        query: DESTROY_PALLET,
        variables: { id: palletA.id },
      })) as TypedGraphQLResponse<{ destroyPallet: Offer }>

      expect(res.errors).toBeUndefined()
      expect(await Pallet.findByPk(palletA.id)).toBeNull()
      expect(res.data?.destroyPallet).toEqual(true)

      expect(await LineItem.findByPk(lineItem.id)).toBeNull()
    })
  })

  describe('Pallet count', () => {
    let multiPallet: Pallet

    beforeEach(async () => {
      multiPallet = await Pallet.create({
        offerId: offer.id,
        palletCount: 1,
        palletType: PalletType.Standard,
        paymentStatus: PaymentStatus.Uninitiated,
        paymentStatusChangeTime: new Date(),
      })
    })

    const UPDATE_PALLET_COUNT = gql`
      mutation ($id: Int!, $input: PalletUpdateInput!) {
        updatePallet(id: $id, input: $input) {
          palletCount
        }
      }
    `

    it('should allow to set the pallet count', async () => {
      const res = (await captainTestServer.executeOperation({
        query: UPDATE_PALLET_COUNT,
        variables: {
          id: multiPallet.id,
          input: {
            palletCount: 3,
          },
        },
      })) as TypedGraphQLResponse<{ updatePallet: Pallet }>

      expect(res.errors).toBeUndefined()
      expect(res.data?.updatePallet?.palletCount).toEqual(3)
    })

    it.each([[0], [-3]])(
      'should not allow %d as pallet count',
      async (palletCount) => {
        const res = (await captainTestServer.executeOperation({
          query: UPDATE_PALLET_COUNT,
          variables: {
            id: multiPallet.id,
            input: {
              palletCount,
            },
          },
        })) as TypedGraphQLResponse<{ updatePallet: Pallet }>
        expect(res.errors).not.toBeUndefined()
        expect(res.errors?.[0].message).toMatch(/Add pallet arguments invalid/)
        expect((res.errors?.[0].extensions?.['0'] as any).instancePath).toMatch(
          /input\/palletCount/,
        )
      },
    )
  })
})
