import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import { AuthenticatedContext } from '../../apolloServer'
import Group from '../../models/group'
import Shipment from '../../models/shipment'
import {
  MutationResolvers,
  QueryResolvers,
  ShipmentInput,
  ShipmentResolvers,
} from '../../server-internal-types'

// Shipment query resolvers
const listShipments: QueryResolvers['listShipments'] = async () => {
  return Shipment.findAll()
}

const shipment: QueryResolvers['shipment'] = async (_, { id }) => {
  const shipment = await Shipment.findByPk(id)
  if (!shipment) {
    throw new ApolloError('No shipment exists with that ID')
  }

  return shipment
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

  const sendingHubPromise = Group.findByPk(input.sendingHubId)
  const receivingHubPromise = Group.findByPk(input.receivingHubId)

  const sendingHub = await sendingHubPromise
  if (!sendingHub) {
    throw new ApolloError('Sending hub not found')
  }

  const receivingHub = await receivingHubPromise
  if (!receivingHub) {
    throw new ApolloError('Receiving hub not found')
  }

  return Shipment.create({
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
  const sendingHub = await Group.findByPk(parent.sendingHubId)
  if (!sendingHub) {
    throw new ApolloError('Sending hub not found')
  }

  return sendingHub
}

const receivingHub: ShipmentResolvers['receivingHub'] = async (parent) => {
  const receivingHub = await Group.findByPk(parent.receivingHubId)
  if (!receivingHub) {
    throw new ApolloError('Receiving hub not found')
  }

  return receivingHub
}

export { listShipments, shipment, addShipment, sendingHub, receivingHub }
