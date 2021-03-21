import { DateResolver } from 'graphql-scalars'
import { Resolvers } from '../server-internal-types'
import { addGroup, group, listGroups, updateGroup } from './group'
import {
  addLineItem,
  destroyLineItem,
  moveLineItem,
  updateLineItem,
} from './line_items'
import { addOffer, listOffers, offer, offerPallets, updateOffer } from './offer'
import {
  addPallet,
  destroyPallet,
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
import { exportShipment } from './shipment_exports'

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
    addLineItem,
    updateLineItem,
    destroyLineItem,
    moveLineItem,
    exportShipment,
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
