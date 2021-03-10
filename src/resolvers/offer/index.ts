import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import { AuthenticatedContext } from '../../apolloServer'
import Group from '../../models/group'
import Offer from '../../models/offer'
import Shipment from '../../models/shipment'
import { sequelize } from '../../sequelize'
import {
  MutationResolvers,
  OfferResolvers,
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

  if (shipment.status !== ShipmentStatus.Staging) {
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

export { addOffer }
