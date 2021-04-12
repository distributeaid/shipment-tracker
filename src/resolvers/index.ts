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
  shipmentExports,
  updateShipment,
} from './shipment'
import { exportShipment, listShipmentExports } from './shipment_exports'

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
    listShipmentExports,
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
    exports: shipmentExports,
  },

  Offer: {
    pallets: offerPallets,
  },

  Pallet: {
    lineItems: palletLineItems,
  },
}

export default resolvers
