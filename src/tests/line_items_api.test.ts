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
  LineItemUpdateInput,
  OfferStatus,
  PalletType,
  PaymentStatus,
  ShipmentStatus,
  ShippingRoute,
} from '../server-internal-types'
import { makeAdminTestServer, makeTestServer } from '../testServer'

describe('LineItems API', () => {
  let adminTestServer: ApolloServerTestClient,
    captainTestServer: ApolloServerTestClient,
    otherUserTestServer: ApolloServerTestClient,
    shipment: Shipment,
    group: Group,
    offer: Offer,
    captain: UserAccount,
    pallet: Pallet

  beforeEach(async () => {
    await sequelize.sync({ force: true })

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
      primaryLocation: { countryCode: 'UK', townCity: 'Bristol' },
      primaryContact: { name: 'Contact', email: 'contact@example.com' },
      captainId: captain.id,
    })

    shipment = await Shipment.create({
      shippingRoute: ShippingRoute.Uk,
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

    pallet = await Pallet.create({
      offerId: offer.id,
      palletType: PalletType.Standard,
      paymentStatus: PaymentStatus.Uninitiated,
      paymentStatusChangeTime: new Date(),
    })
  })

  describe('addLineItem', () => {
    const ADD_LINE_ITEM = gql`
      mutation($palletId: Int!) {
        addLineItem(palletId: $palletId) {
          lineItems {
            offerPalletId
            status
            containerType
            category
            itemCount
            affirmLiability
            tosAccepted
            dangerousGoods
            photoUris
            statusChangeTime
          }
        }
      }
    `

    it('creates a new line item', async () => {
      const res = await captainTestServer.mutate<
        { addLineItem: Pallet },
        { palletId: number }
      >({
        mutation: ADD_LINE_ITEM,
        variables: {
          palletId: pallet.id,
        },
      })

      expect(res.errors).toBeUndefined()

      const newLineItem = res?.data?.addLineItem?.lineItems?.[0]!
      expect(newLineItem.offerPalletId).toEqual(pallet.id)
      expect(newLineItem.status).toEqual(LineItemStatus.Proposed)
      expect(newLineItem.containerType).toEqual(LineItemContainerType.Unset)
      expect(newLineItem.category).toEqual(LineItemCategory.Unset)
    })
  })

  describe('actions on an existing line item', () => {
    let lineItem: LineItem

    beforeEach(async () => {
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

    describe('updateLineItem', () => {
      const UPDATE_LINE_ITEM = gql`
        mutation($id: Int!, $input: LineItemUpdateInput!) {
          updateLineItem(id: $id, input: $input) {
            offerPalletId
            status
            containerType
            category
            itemCount
            affirmLiability
            tosAccepted
            dangerousGoods
            photoUris
            statusChangeTime
          }
        }
      `

      it('udpates an existing line item', async () => {
        const res = await captainTestServer.mutate<
          { updateLineItem: LineItem },
          { id: number; input: LineItemUpdateInput }
        >({
          mutation: UPDATE_LINE_ITEM,
          variables: {
            id: lineItem.id,
            input: {
              status: LineItemStatus.Accepted,
            },
          },
        })

        expect(res.errors).toBeUndefined()
        expect(res.data?.updateLineItem?.status).toEqual(
          LineItemStatus.Accepted,
        )
      })
    })

    describe('destroyLineItem', () => {
      const DESTROY_LINE_ITEM = gql`
        mutation($id: Int!) {
          destroyLineItem(id: $id) {
            id
            lineItems {
              id
            }
          }
        }
      `

      it('destroys an existing line item', async () => {
        const res = await captainTestServer.mutate<
          { destroyLineItem: Pallet },
          { id: number }
        >({
          mutation: DESTROY_LINE_ITEM,
          variables: {
            id: lineItem.id,
          },
        })

        expect(res.errors).toBeUndefined()
        expect(res.data?.destroyLineItem?.lineItems.length).toEqual(0)
      })
    })

    describe('moveLineItem', () => {
      let palletTwo: Pallet

      const MOVE_LINE_ITEM = gql`
        mutation($id: Int!, $targetPalletId: Int!) {
          moveLineItem(id: $id, targetPalletId: $targetPalletId) {
            pallets {
              id
              lineItems {
                id
              }
            }
          }
        }
      `

      beforeEach(async () => {
        palletTwo = await Pallet.create({
          offerId: offer.id,
          palletType: PalletType.Standard,
          paymentStatus: PaymentStatus.Uninitiated,
          paymentStatusChangeTime: new Date(),
        })
      })

      it('moves the line item to another pallet in the same offer', async () => {
        const res = await captainTestServer.mutate<
          { moveLineItem: Offer },
          { id: number; targetPalletId: number }
        >({
          mutation: MOVE_LINE_ITEM,
          variables: {
            id: lineItem.id,
            targetPalletId: palletTwo.id,
          },
        })

        expect(res.errors).toBeUndefined()

        await palletTwo.reload({ include: 'lineItems' })

        expect(palletTwo.lineItems[0].id).toEqual(lineItem.id)
        expect(res.data?.moveLineItem?.pallets.length).toEqual(2)

        expect(res.data?.moveLineItem?.pallets.length).toEqual(2)

        const originalPallet = res.data?.moveLineItem?.pallets.find(
          (p) => p.id === pallet.id,
        )
        const targetPallet = res.data?.moveLineItem?.pallets.find(
          (p) => p.id === palletTwo.id,
        )

        expect(originalPallet!.lineItems.length).toEqual(0)
        expect(targetPallet!.lineItems[0].id).toEqual(lineItem.id)
      })
    })
  })
})
