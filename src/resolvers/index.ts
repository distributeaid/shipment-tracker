import { DateResolver } from 'graphql-scalars'
import { Resolvers } from '../server-internal-types'
import { addGroup, updateGroup, group, listGroups } from './group'
import { addOffer, updateOffer, offer, listOffers } from './offer'
import { addPallet, updatePallet, destroyPallet } from './pallet'
import {
  addShipment,
  listShipments,
  receivingHub,
  sendingHub,
  shipment,
  updateShipment,
} from './shipment'

const resolvers: Resolvers = {
  // Third Party Resolvers
  Date: DateResolver,

  // Query Resolvers
  Query: {
    group,
    shipment,
    listGroups,
    listShipments,
    offer,
    listOffers,
  },

  // Mutation Resolvers
  Mutation: {
    addGroup,
    updateGroup,
    addShipment,
    updateShipment,
    addOffer,
    updateOffer,
    addPallet,
    updatePallet,
    destroyPallet,
  },

  // Custom Resolvers
  Shipment: {
    sendingHub,
    receivingHub,
  },
}

export default resolvers
