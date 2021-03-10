import { UserInputError, ApolloError, ForbiddenError } from 'apollo-server'

import {
  QueryResolvers,
  MutationResolvers,
  ShipmentResolvers,
  ShipmentInput,
} from '../../server-internal-types'
import { sequelize } from '../../sequelize'
import Shipment from '../../models/shipment'
import Group from '../../models/group'
import { AuthenticatedContext } from '../../apolloServer'

const shipmentRepository = sequelize.getRepository(Shipment)
const groupRepository = sequelize.getRepository(Group)

// Shipment query resolvers
const listShipments: QueryResolvers['listShipments'] = async () => {
  return shipmentRepository.findAll()
}

// Shipment mutation resolvers
const addShipment: MutationResolvers['addShipment'] = async (
  _parent,
  { input },
  context: AuthenticatedContext,
) => {
  if (!context.auth.isAdmin) {
    throw new ForbiddenError('addShipment forbidden to non-admin users')
  }

  if (
    !input.shippingRoute ||
    !input.labelYear ||
    !input.labelMonth ||
    !input.sendingHubId ||
    !input.receivingHubId ||
    !input.status
  ) {
    throw new UserInputError('Shipment arguments invalid', {
      invalidArgs: Object.keys(input).filter(
        (key) => !input[key as keyof ShipmentInput],
      ),
    })
  }

  const sendingHubPromise = groupRepository.findByPk(input.sendingHubId)
  const receivingHubPromise = groupRepository.findByPk(input.receivingHubId)

  const sendingHub = await sendingHubPromise
  if (!sendingHub) {
    throw new ApolloError('Sending hub not found')
  }

  const receivingHub = await receivingHubPromise
  if (!receivingHub) {
    throw new ApolloError('Receiving hub not found')
  }

  return shipmentRepository.create({
    shippingRoute: input.shippingRoute,
    labelYear: input.labelYear,
    labelMonth: input.labelMonth,
    sendingHubId: input.sendingHubId,
    receivingHubId: input.receivingHubId,
    status: input.status,
    statusChangeTime: new Date(),
  })
}

// Shipment custom resolvers
const sendingHub: ShipmentResolvers['sendingHub'] = async (parent) => {
  const sendingHub = await groupRepository.findByPk(parent.sendingHubId)
  if (!sendingHub) {
    throw new ApolloError('Sending hub not found')
  }

  return sendingHub
}

const receivingHub: ShipmentResolvers['receivingHub'] = async (parent) => {
  const receivingHub = await groupRepository.findByPk(parent.receivingHubId)
  if (!receivingHub) {
    throw new ApolloError('Receiving hub not found')
  }

  return receivingHub
}

export { listShipments, addShipment, sendingHub, receivingHub }
