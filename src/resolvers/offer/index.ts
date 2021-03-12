import { ForbiddenError, UserInputError } from 'apollo-server'
import { omit } from 'lodash'
import { AuthenticatedContext } from '../../apolloServer'
import Group from '../../models/group'
import Offer, { OfferAttributes } from '../../models/offer'
import Shipment from '../../models/shipment'
import { sequelize } from '../../sequelize'
import {
  MutationResolvers,
  OfferStatus,
  ShipmentStatus,
} from '../../server-internal-types'

const offerRepository = sequelize.getRepository(Offer)
const groupRepository = sequelize.getRepository(Group)
const shipmentRepository = sequelize.getRepository(Shipment)

const addOffer: MutationResolvers['addOffer'] = async (
  _parent,
  { input },
  context: AuthenticatedContext,
) => {
  if (!input.sendingGroupId || !input.shipmentId) {
    throw new UserInputError('Offer arguments invalid')
  }

  const sendingGroupPromise = groupRepository.findByPk(input.sendingGroupId)
  const shipmentPromise = shipmentRepository.findByPk(input.shipmentId)
  const existingOfferCountPromise = offerRepository.count({
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

  return offerRepository.create({
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

  const offer = await offerRepository.findByPk(input.id)

  if (!offer) {
    throw new UserInputError(`Offer ${input.id} does not exist`)
  }

  // This sucks, there's apparently a bug making it very annoying to
  // do eager loading of model associations when using sequelize-typescript
  // in repository mode. See issue #76.
  // TODO(#75): stop using sequelize repository mode
  const group = await groupRepository.findByPk(offer.sendingGroupId)

  if (
    !context.auth.isAdmin &&
    context.auth.userAccount.id !== group?.captainId
  ) {
    throw new ForbiddenError('Not permitted to update group')
  }

  if (input.status != null) {
    updateAttributes.statusChangeTime = new Date()
  }

  const [_n, updatedOffers] = await offerRepository.update(updateAttributes, {
    where: { id: offer.id },
    returning: true,
  })

  return updatedOffers[0]
}

export { addOffer, updateOffer }
