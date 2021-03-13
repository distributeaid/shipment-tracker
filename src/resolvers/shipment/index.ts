import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import Group from '../../models/group'
import Shipment, { ShipmentAttributes } from '../../models/shipment'
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
  _,
  { input },
  context,
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

const updateShipment: MutationResolvers['updateShipment'] = async (
  _,
  { id, input },
  context,
) => {
  if (!context.auth.isAdmin) {
    throw new ForbiddenError('updateShipment forbidden to non-admin users')
  }

  const shipment = await Shipment.findByPk(id)
  if (!shipment) {
    throw new ApolloError('No shipment exists with that ID')
  }

  const { status, receivingHubId, sendingHubId, ...rest } = input
  const updateAttributes: Partial<ShipmentAttributes> = { ...rest }

  if (status) {
    updateAttributes.status = status
    updateAttributes.statusChangeTime = new Date()
  }
  if (receivingHubId) {
    const receivingHub = await Group.findByPk(receivingHubId)
    if (!receivingHub) {
      throw new ApolloError('No receiving group exists with that ID')
    }

    updateAttributes.receivingHubId = receivingHubId
  }
  if (sendingHubId) {
    const sendingHub = await Group.findByPk(sendingHubId)
    if (!sendingHub) {
      throw new ApolloError('No sending group exists with that ID')
    }

    updateAttributes.sendingHubId = sendingHubId
  }

  return shipment.update(updateAttributes)
}

// Shipment custom resolvers
const sendingHub: ShipmentResolvers['sendingHub'] = async (parent) => {
  const sendingHub = await Group.findByPk(parent.sendingHubId)
  if (!sendingHub) {
    throw new ApolloError('No sending group exists with that Id')
  }

  return sendingHub
}

const receivingHub: ShipmentResolvers['receivingHub'] = async (parent) => {
  const receivingHub = await Group.findByPk(parent.receivingHubId)
  if (!receivingHub) {
    throw new ApolloError('No receiving group exists with that ID')
  }

  return receivingHub
}

export {
  listShipments,
  shipment,
  addShipment,
  updateShipment,
  sendingHub,
  receivingHub,
}
