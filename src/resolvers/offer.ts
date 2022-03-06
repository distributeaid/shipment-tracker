import { Type } from '@sinclair/typebox'
import { ForbiddenError, UserInputError } from 'apollo-server'
import { strict as assert } from 'assert'
import { Contact } from '../input-validation/Contact'
import { validateIdInput } from '../input-validation/idInputSchema'
import { ID, URI } from '../input-validation/types'
import { validateWithJSONSchema } from '../input-validation/validateWithJSONSchema'
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
  assert.ok(
    typeof context.auth.userId === 'number',
    'Current user id should be set',
  )
  const valid = validateAddOfferInput(input)
  if ('errors' in valid) {
    throw new UserInputError('Add offer arguments invalid', valid.errors)
  }

  const sendingGroupPromise = Group.getWithCaptainAssociation(
    valid.value.sendingGroupId,
  )
  const shipmentPromise = Shipment.findByPk(valid.value.shipmentId)
  const existingOfferCountPromise = Offer.count({
    where: {
      sendingGroupId: valid.value.sendingGroupId,
      shipmentId: valid.value.sendingGroupId,
    },
  })

  const sendingGroup = await sendingGroupPromise
  if (sendingGroup == null) {
    throw new UserInputError(
      `Group ${valid.value.sendingGroupId} does not exist`,
    )
  }
  if (sendingGroup.captainId !== context.auth.userId && !context.auth.isAdmin) {
    throw new ForbiddenError(
      `User ${context.auth.userId} not permitted to create offer for group ${valid.value.sendingGroupId}`,
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

  const { id } = await Offer.create({
    ...valid.value,
    status: OfferStatus.Draft,
    statusChangeTime: new Date(),
  })

  return ((await Offer.getWithChildAssociations(id)) as Offer).toWireFormat()
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

  const offer = await Offer.getWithChildAssociations(valid.value.id)

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

  return (await offer.update(updateAttributes)).toWireFormat()
}

// Offer query resolvers

const offer: QueryResolvers['offer'] = async (_, { id }, context) => {
  const valid = validateIdInput({ id })
  if ('errors' in valid) {
    throw new UserInputError('Offer arguments invalid', valid.errors)
  }

  const offer = await Offer.getWithChildAssociations(id)

  if (!offer) {
    throw new UserInputError(`Offer ${id} does not exist`)
  }

  authorizeOfferQuery(offer, context)

  return offer.toWireFormat()
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
    where: { captainId: context.auth.userId },
  })
  const shipment = await Shipment.findByPk(shipmentId)

  if (!shipment) {
    throw new UserInputError(`Shipment ${shipmentId} does not exist`)
  }

  if (context.auth.isAdmin) {
    return (
      await Offer.findAllWithChildAssociations({ where: { shipmentId } })
    ).map((offer) => offer.toWireFormat())
  }

  const groupIds = (await groupsPromise).map((group) => group.id)
  return (
    await Offer.findAllWithChildAssociations({
      where: { shipmentId, sendingGroupId: groupIds },
    })
  ).map((offer) => offer.toWireFormat())
}

const offerPallets: OfferResolvers['pallets'] = async (parent) => {
  return (await Pallet.findAll({ where: { offerId: parent.id } })).map(
    (pallet) => pallet.toWireFormat(),
  )
}

export { addOffer, updateOffer, offer, listOffers, offerPallets }
