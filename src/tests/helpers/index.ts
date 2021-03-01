import Group from '../../models/group'
import Shipment from '../../models/shipment'
import { sequelize } from '../../sequelize'
import { ShipmentInput } from '../../server-internal-types'

async function createGroup(name: string): Promise<Group> {
  return await sequelize.getRepository(Group).create({ name })
}

async function createShipment(input: ShipmentInput): Promise<Shipment> {
  return await sequelize.getRepository(Shipment).create(input)
}

export { createGroup, createShipment }
