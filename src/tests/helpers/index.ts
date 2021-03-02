import Group from '../../models/group'
import Shipment from '../../models/shipment'
import { sequelize } from '../../sequelize'
import { GroupInput, ShipmentInput } from '../../server-internal-types'

async function createGroup(input: GroupInput): Promise<Group> {
  return await sequelize.getRepository(Group).create(input)
}

async function createShipment(input: ShipmentInput): Promise<Shipment> {
  return await sequelize.getRepository(Shipment).create(input)
}

export { createGroup, createShipment }
