import { DateResolver } from 'graphql-scalars'

import { Resolvers } from './server-internal-types'
import { listGroups, addGroup } from './resolvers/group'
import {
  addShipment,
  listShipments,
  receivingHub,
  sendingHub,
} from './resolvers/shipment'

const resolvers: Resolvers = {
  // Third Party Resolvers
  Date: DateResolver,

  // Query Resolvers
  Query: {
    listGroups,
    listShipments,
  },

  // Mutation Resolvers
  Mutation: {
    addGroup,
    addShipment,
  },

  // Custom Resolvers
  Shipment: {
    sendingHub,
    receivingHub,
  },
}

export default resolvers
