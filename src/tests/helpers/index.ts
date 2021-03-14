import { Maybe } from 'graphql/jsutils/Maybe'
import Group from '../../models/group'
import Offer from '../../models/offer'
import Shipment from '../../models/shipment'
import UserAccount from '../../models/user_account'
import {
  GroupCreateInput,
  OfferCreateInput,
  ShipmentCreateInput,
} from '../../server-internal-types'

let fakeAuth0Id = 1

async function createGroup(
  input: GroupCreateInput,
  captainId: Maybe<number> = null,
): Promise<Group> {
  if (!captainId) {
    const groupCaptain = await UserAccount.create({
      auth0Id: `fake-auth-id-${fakeAuth0Id++}`,
    })
    captainId = groupCaptain.id
  }

  return await Group.create({ ...input, captainId })
}

async function createShipment(input: ShipmentCreateInput): Promise<Shipment> {
  return await Shipment.create(input)
}

export { createGroup, createShipment }
