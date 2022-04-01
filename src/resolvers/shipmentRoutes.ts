import { Region } from '../data/regions'
import { ShipmentRoute, shipmentRoutes } from '../data/shipmentRoutes'
import { QueryResolvers } from '../server-internal-types'

export const listShipmentRoutes: QueryResolvers['shipmentRoutes'] = async () =>
  Object.values(shipmentRoutes) as (ShipmentRoute & {
    servingRegions: Region[]
  })[]
