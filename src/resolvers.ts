import { DateResolver } from 'graphql-scalars'

import { Resolvers } from './server-internal-types'
import { addGroup, group, listGroups } from './resolvers/group'

import {
  addShipment,
  listShipments,
  receivingHub,
  sendingHub,
} from './resolvers/shipment'

import { addOffer, updateOffer } from './resolvers/offer'

const resolvers: Resolvers = {
  // Third Party Resolvers
  Date: DateResolver,

  // Query Resolvers
  Query: {
    group,
    listGroups,
    listShipments,
  },

  // Mutation Resolvers
  Mutation: {
    addGroup,
    addShipment,
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
