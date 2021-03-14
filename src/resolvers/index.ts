import { DateResolver } from 'graphql-scalars'
import { Resolvers } from '../server-internal-types'
import { addGroup, updateGroup, group, listGroups } from './group'
import { addOffer, updateOffer } from './offer'
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
  },

  // Mutation Resolvers
  Mutation: {
    addGroup,
    updateGroup,
    addShipment,
    updateShipment,
    addOffer,
    updateOffer,
  },

  // Custom Resolvers
  Shipment: {
    sendingHub,
    receivingHub,
  },
}

export default resolvers
