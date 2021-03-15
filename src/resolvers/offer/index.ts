import { ForbiddenError, UserInputError } from 'apollo-server'
import { has } from 'lodash'
import Group from '../../models/group'
import Offer, { OfferAttributes } from '../../models/offer'
import Pallet from '../../models/pallet'
import Shipment from '../../models/shipment'
import {
  MutationResolvers,
  OfferResolvers,
  OfferStatus,
  QueryResolvers,
  ShipmentStatus,
} from '../../server-internal-types'
import stringIsUrl from '../group/stringIsUrl'
import {
  authorizeOfferMutation,
  authorizeOfferQuery,
} from './offer_authorization'

const addOffer: MutationResolvers['addOffer'] = async (
  _parent,
  { input },
  context,
) => {
  if (!input.sendingGroupId || !input.shipmentId) {
    throw new UserInputError('Offer arguments invalid')
  }

  if (input.photoUris) {
    const invalidUris = input.photoUris.filter((uri) => !stringIsUrl(uri))

    if (invalidUris.length > 0) {
      throw new UserInputError(
        `Invalid photo URI(s): ${invalidUris.join(', ')}`,
      )
    }
  }

  const sendingGroupPromise = Group.findByPk(input.sendingGroupId)
  const shipmentPromise = Shipment.findByPk(input.shipmentId)
  const existingOfferCountPromise = Offer.count({
    where: {
      sendingGroupId: input.sendingGroupId,
      shipmentId: input.sendingGroupId,
    },
  })

  const sendingGroup = await sendingGroupPromise
  if (sendingGroup?.captainId !== context.auth.userAccount.id) {
    throw new ForbiddenError(
      `User ${context.auth.userAccount.id} not permitted to create offer for group ${input.sendingGroupId}`,
    )
  }

  const shipment = await shipmentPromise
  if (shipment == null) {
    throw new UserInputError(`Shipment ${input.shipmentId} does not exist`)
  }

  if (shipment.status !== ShipmentStatus.Open) {
    throw new UserInputError(
      `Shipment ${input.shipmentId} is not accepting offers`,
    )
  }

  const existingOfferCount = await existingOfferCountPromise
  if (existingOfferCount > 0) {
    throw new UserInputError(
      `Shipment ${input.shipmentId} already has offer from group ${input.sendingGroupId}`,
    )
  }

  return Offer.create({
    status: OfferStatus.Draft,
    statusChangeTime: new Date(),
    contact: input.contact,
    shipmentId: input.shipmentId,
    sendingGroupId: input.sendingGroupId,
    photoUris: input.photoUris || [],
  })
}

const updateOffer: MutationResolvers['updateOffer'] = async (
  _parent,
  { input },
  context,
) => {
  const offer = await Offer.findByPk(input.id, {
    include: [{ association: 'sendingGroup' }, { association: 'shipment' }],
  })

  if (!offer) {
    throw new UserInputError(`Offer ${input.id} does not exist`)
  }

  authorizeOfferMutation(offer, context)

  const updateAttributes: Partial<OfferAttributes> = {}

  if (input.status) {
    updateAttributes.status = input.status
    updateAttributes.statusChangeTime = new Date()
  }

  if (has(input, 'contact')) {
    updateAttributes.contact = input.contact
  }

  if (has(input, 'photoUris')) {
    const invalidUris = (input.photoUris || []).filter(
      (uri) => !stringIsUrl(uri),
    )

    if (invalidUris.length > 0) {
      throw new UserInputError(
        `Invalid photo URI(s): ${invalidUris.join(', ')}`,
      )
    }

    updateAttributes.photoUris = input.photoUris || []
  }

  return offer.update(updateAttributes)
}

const offer: QueryResolvers['offer'] = async (_, { id }, context) => {
  const offer = await Offer.findByPk(id, {
    include: [{ association: 'sendingGroup' }, { association: 'shipment' }],
  })

  if (!offer) {
    throw new UserInputError(`Offer ${id} does not exist`)
  }

  authorizeOfferQuery(offer, context)

  return offer
}

const listOffers: QueryResolvers['listOffers'] = async (
  _,
  { shipmentId },
  context,
) => {
  const groupsPromise = Group.findAll({
    where: { captainId: context.auth.userAccount.id },
  })
  const shipment = await Shipment.findByPk(shipmentId)

  if (!shipment) {
    throw new UserInputError(`Shipment ${shipmentId} does not exist`)
  }

  const groupIds = (await groupsPromise).map((group) => group.id)

  if (context.auth.isAdmin) {
    return Offer.findAll({ where: { shipmentId } })
  }

  return Offer.findAll({ where: { shipmentId, sendingGroupId: groupIds } })
}

const offerPallets: OfferResolvers['pallets'] = async (parent) => {
  return Pallet.findAll({ where: { offerId: parent.id } })
}

export { addOffer, updateOffer, offer, listOffers, offerPallets }
