import { DateResolver } from 'graphql-scalars'
import { Resolvers } from '../server-internal-types'
import { listCountries } from './countries'
import { addGroup, group, listGroups, updateGroup } from './group'
import {
  acceptedReceivingGroup,
  addLineItem,
  destroyLineItem,
  lineItem,
  moveLineItem,
  proposedReceivingGroup,
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
import { listRegions } from './regions'
import {
  addShipment,
  listShipments,
  receivingHubs,
  sendingHubs,
  shipment,
  shipmentExports,
  updateShipment,
} from './shipment'
import { listShipmentRoutes } from './shipmentRoutes'
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
    countries: listCountries,
    shipmentRoutes: listShipmentRoutes,
    regions: listRegions,
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
    sendingHubs,
    receivingHubs,
    exports: shipmentExports,
  },

  Offer: {
    pallets: offerPallets,
  },

  Pallet: {
    lineItems: palletLineItems,
  },

  LineItem: {
    proposedReceivingGroup,
    acceptedReceivingGroup,
  },
}

export default resolvers
