import { UserInputError } from 'apollo-server'

import {
  QueryResolvers,
  MutationResolvers,
  ShipmentResolvers,
  ShipmentInput,
} from '../../server-internal-types'
import { sequelize } from '../../sequelize'
import Shipment from '../../models/shipment'
import Group from '../../models/group'

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
  _context,
) => {
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
  return (await groupRepository.findByPk(parent.sendingHubId)) ?? {}
}

const receivingHub: ShipmentResolvers['receivingHub'] = async (parent) => {
  return (await groupRepository.findByPk(parent.receivingHubId)) ?? {}
}

export { listShipments, addShipment, sendingHub, receivingHub }
