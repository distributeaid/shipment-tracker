import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import { omit } from 'lodash'
import { AuthenticatedContext } from '../../apolloServer'
import Group from '../../models/group'
import Offer, { OfferAttributes } from '../../models/offer'
import Shipment from '../../models/shipment'
import {
  MutationResolvers,
  OfferStatus,
  ShipmentStatus,
} from '../../server-internal-types'

const addOffer: MutationResolvers['addOffer'] = async (
  _parent,
  { input },
  context: AuthenticatedContext,
) => {
  if (!input.sendingGroupId || !input.shipmentId) {
    throw new UserInputError('Offer arguments invalid')
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
  context: AuthenticatedContext,
) => {
  // TODO figure out a better way to convert attributes before merging
  // @ts-ignore
  const updateAttributes: Partial<OfferAttributes> = omit(input, 'id')

  const offer = await Offer.findByPk(input.id, {
    include: { association: 'sendingGroup' },
  })

  const group = offer?.sendingGroup

  if (!offer) {
    throw new UserInputError(`Offer ${input.id} does not exist`)
  }

  if (!group) {
    throw new ApolloError(`Offer ${offer.id} has no group!`)
  }

  if (
    !context.auth.isAdmin &&
    context.auth.userAccount.id !== group.captainId
  ) {
    throw new ForbiddenError('Not permitted to update group')
  }

  if (input.status != null) {
    updateAttributes.statusChangeTime = new Date()
  }

  return offer.update(updateAttributes)
}

export { addOffer, updateOffer }
