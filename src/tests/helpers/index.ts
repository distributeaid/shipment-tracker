import Group from '../../models/group'
import Shipment from '../../models/shipment'
import UserAccount from '../../models/user_account'
import { sequelize } from '../../sequelize'
import { GroupInput, ShipmentInput } from '../../server-internal-types'

let fakeAuth0Id = 1

async function createGroup(input: GroupInput): Promise<Group> {
  const groupCaptain = await sequelize
    .getRepository(UserAccount)
    .create({ auth0Id: `fake-auth-id-${fakeAuth0Id++}` })

  return await sequelize
    .getRepository(Group)
    .create({ ...input, captainId: groupCaptain.id })
}

async function createShipment(input: ShipmentInput): Promise<Shipment> {
  return await sequelize.getRepository(Shipment).create(input)
}

export { createGroup, createShipment }
