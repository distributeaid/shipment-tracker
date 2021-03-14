import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import { has } from 'lodash'
import Group from '../../models/group'
import Offer, { OfferAttributes } from '../../models/offer'
import Shipment from '../../models/shipment'
import {
  MutationResolvers,
  OfferStatus,
  QueryResolvers,
  ShipmentStatus,
} from '../../server-internal-types'
import stringIsUrl from '../group/stringIsUrl'

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
    include: { association: 'sendingGroup' },
  })

  if (!offer) {
    throw new UserInputError(`Offer ${input.id} does not exist`)
  }

  const group = offer?.sendingGroup

  if (!group) {
    throw new ApolloError(`Offer ${offer.id} has no group!`)
  }

  if (
    !context.auth.isAdmin &&
    context.auth.userAccount.id !== group.captainId
  ) {
    throw new ForbiddenError('Not permitted to update offer')
  }

  const updateAttributes: Partial<OfferAttributes> = {}

  if (input.status) {
    updateAttributes.status = input.status
    updateAttributes.statusChangeTime = new Date()
  }

  if (has(input, 'contact')) {
    updateAttributes.contact = input.contact
  }

  if (has(input, 'photoUris')) {
    updateAttributes.photoUris = input.photoUris || []
  }

  return offer.update(updateAttributes)
}

const offer: QueryResolvers['offer'] = async (_, { id }, context) => {
  const offer = await Offer.findByPk(id, {
    include: { association: 'sendingGroup' },
  })

  if (!offer) {
    throw new UserInputError(`Offer ${id} does not exist`)
  }

  if (!offer.sendingGroup) {
    throw new ApolloError(`Offer ${id} has no group!`)
  }

  if (
    offer.sendingGroup.captainId !== context.auth.userAccount.id &&
    !context.auth.isAdmin
  ) {
    throw new ForbiddenError('Not permitted to view that offer')
  }

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

export { addOffer, updateOffer, offer, listOffers }
