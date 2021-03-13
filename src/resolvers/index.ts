import { DateResolver } from 'graphql-scalars'
import { Resolvers } from '../server-internal-types'
import { addGroup, group, listGroups } from './group'
import { addOffer, updateOffer } from './offer'
import {
  addShipment,
  listShipments,
  receivingHub,
  sendingHub,
  shipment,
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
