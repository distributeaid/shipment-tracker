import { Type } from '@sinclair/typebox'
import { ForbiddenError, UserInputError } from 'apollo-server'
import Group from '../models/group'
import Offer, { OfferAttributes } from '../models/offer'
import Pallet from '../models/pallet'
import Shipment from '../models/shipment'
import {
  MutationResolvers,
  OfferResolvers,
  OfferStatus,
  QueryResolvers,
  ShipmentStatus,
} from '../server-internal-types'
import { Contact } from './input-validation/Contact'
import { validateIdInput } from './input-validation/idInputSchema'
import { ID, URI } from './input-validation/types'
import { validateWithJSONSchema } from './input-validation/validateWithJSONSchema'
import {
  authorizeOfferMutation,
  authorizeOfferQuery,
} from './offer_authorization'

// Offer mutation resolvers

// - add offer

export const addOfferInput = Type.Object(
  {
    sendingGroupId: ID,
    shipmentId: ID,
    contact: Contact,
    photoUris: Type.Optional(Type.Array(URI)),
  },
  { additionalProperties: false },
)

const validateAddOfferInput = validateWithJSONSchema(addOfferInput)

const addOffer: MutationResolvers['addOffer'] = async (
  _parent,
  { input },
  context,
) => {
  const valid = validateAddOfferInput(input)
  if ('errors' in valid) {
    throw new UserInputError('Add offer arguments invalid', valid.errors)
  }

  const sendingGroupPromise = Group.findByPk(valid.value.sendingGroupId)
  const shipmentPromise = Shipment.findByPk(valid.value.shipmentId)
  const existingOfferCountPromise = Offer.count({
    where: {
      sendingGroupId: valid.value.sendingGroupId,
      shipmentId: valid.value.sendingGroupId,
    },
  })

  const sendingGroup = await sendingGroupPromise
  if (sendingGroup?.captainId !== context.auth.userAccount.id) {
    throw new ForbiddenError(
      `User ${context.auth.userAccount.id} not permitted to create offer for group ${valid.value.sendingGroupId}`,
    )
  }

  const shipment = await shipmentPromise
  if (shipment == null) {
    throw new UserInputError(
      `Shipment ${valid.value.shipmentId} does not exist`,
    )
  }

  if (shipment.status !== ShipmentStatus.Open) {
    throw new UserInputError(
      `Shipment ${valid.value.shipmentId} is not accepting offers`,
    )
  }

  const existingOfferCount = await existingOfferCountPromise
  if (existingOfferCount > 0) {
    throw new UserInputError(
      `Shipment ${valid.value.shipmentId} already has offer from group ${valid.value.sendingGroupId}`,
    )
  }

  return Offer.create({
    ...valid.value,
    status: OfferStatus.Draft,
    statusChangeTime: new Date(),
  })
}

// - update offer

export const updateOfferInput = Type.Object(
  {
    id: ID,
    status: Type.Enum(OfferStatus),
    contact: Type.Optional(Contact),
    photoUris: Type.Optional(Type.Array(URI)),
  },
  { additionalProperties: false },
)

const validateUpdateOfferInput = validateWithJSONSchema(updateOfferInput)

const updateOffer: MutationResolvers['updateOffer'] = async (
  _parent,
  { input },
  context,
) => {
  const valid = validateUpdateOfferInput(input)
  if ('errors' in valid) {
    throw new UserInputError('Update offer arguments invalid', valid.errors)
  }

  const offer = await Offer.findByPk(valid.value.id, {
    include: [{ association: 'sendingGroup' }, { association: 'shipment' }],
  })

  if (!offer) {
    throw new UserInputError(`Offer ${valid.value.id} does not exist`)
  }

  authorizeOfferMutation(offer, context)

  const updateAttributes: Partial<OfferAttributes> = {}

  if (valid.value.status) {
    updateAttributes.status = valid.value.status
    updateAttributes.statusChangeTime = new Date()
  }

  if (input.contact !== undefined) {
    updateAttributes.contact = valid.value.contact
  }

  if (input.photoUris !== undefined) {
    updateAttributes.photoUris = valid.value.photoUris
  }

  return offer.update(updateAttributes)
}

// Offer query resolvers

const offer: QueryResolvers['offer'] = async (_, { id }, context) => {
  const valid = validateIdInput({ id })
  if ('errors' in valid) {
    throw new UserInputError('Offer arguments invalid', valid.errors)
  }

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
  const valid = validateWithJSONSchema(
    Type.Object(
      {
        shipmentId: ID,
      },
      { additionalProperties: false },
    ),
  )({ shipmentId })
  if ('errors' in valid) {
    throw new UserInputError('Offer arguments invalid', valid.errors)
  }

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
