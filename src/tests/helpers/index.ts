import { GraphQLResponse } from 'apollo-server-types'
import { Maybe } from 'graphql/jsutils/Maybe'
import Group from '../../models/group'
import Shipment from '../../models/shipment'
import ShipmentReceivingHub from '../../models/shipment_receiving_hub'
import ShipmentSendingHub from '../../models/shipment_sending_hub'
import UserAccount from '../../models/user_account'
import {
  GroupCreateInput,
  ShipmentCreateInput,
} from '../../server-internal-types'

let fakeUserCounter = 1

async function createGroup(
  input: GroupCreateInput,
  captainId: Maybe<number> = null,
): Promise<Group> {
  if (!captainId) {
    const groupCaptain = await UserAccount.create({
      email: `fake-auth-id-${fakeUserCounter++}@example.com`,
      passwordHash: '',
      name: 'Captain',
    })
    captainId = groupCaptain.id
  }

  return await Group.create({ ...input, captainId })
}

async function createShipment(input: ShipmentCreateInput): Promise<Shipment> {
  const [receivingHubs, sendingHubs] = await Promise.all([
    Group.findAll({ where: { id: input.receivingHubs } }),
    Group.findAll({ where: { id: input.sendingHubs } }),
  ])
  const shipment = await Shipment.create({
    ...input,
    pricing: input.pricing || undefined,
    receivingHubs,
    sendingHubs,
  })
  await Promise.all([
    Promise.all(
      sendingHubs.map((hub) =>
        ShipmentSendingHub.create({
          hubId: hub.id,
          shipmentId: shipment.id,
        }),
      ),
    ),
    Promise.all(
      receivingHubs.map((hub) =>
        ShipmentReceivingHub.create({
          hubId: hub.id,
          shipmentId: shipment.id,
        }),
      ),
    ),
  ])
  return Shipment.findByPk(shipment.id, {
    include: [
      {
        model: Group,
        as: 'sendingHubs',
      },
      {
        model: Group,
        as: 'receivingHubs',
      },
    ],
  }) as Promise<Shipment>
}

export { createGroup, createShipment }

export type TypedGraphQLResponse<DataType extends Record<string, any>> = Omit<
  GraphQLResponse,
  'data'
> & { data: DataType | null | undefined }
