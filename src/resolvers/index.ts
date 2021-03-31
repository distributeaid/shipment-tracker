import { DateResolver } from 'graphql-scalars'
import { Resolvers } from '../server-internal-types'
import { addGroup, group, listGroups, updateGroup } from './group'
import {
  addLineItem,
  destroyLineItem,
  lineItem,
  moveLineItem,
  updateLineItem,
} from './line_items'
import { addOffer, listOffers, offer, offerPallets, updateOffer } from './offer'
import {
  addPallet,
  destroyPallet,
  pallet,
  palletLineItems,
  updatePallet,
} from './pallet'
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
    pallet,
    lineItem,
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
    addLineItem,
    updateLineItem,
    destroyLineItem,
    moveLineItem,
  },

  // Custom Resolvers
  Shipment: {
    sendingHub,
    receivingHub,
  },

  Offer: {
    pallets: offerPallets,
  },

  Pallet: {
    lineItems: palletLineItems,
  },
}

export default resolvers
