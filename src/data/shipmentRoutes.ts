import { knownRegions, Region } from './regions'

export type ShipmentRoute = {
  id: string
  origin: Region
  servingRegions: Readonly<Region[]>
}

export const shipmentRoutes: Record<string, ShipmentRoute> = {
  DeToBa: {
    id: 'DeToBa',
    origin: knownRegions.germany,
    servingRegions: [knownRegions.bosnia],
  } as ShipmentRoute,
  DeToRs: {
    id: 'DeToRs',
    origin: knownRegions.germany,
    servingRegions: [knownRegions.serbia],
  } as ShipmentRoute,
  DeToFr: {
    id: 'DeToFr',
    origin: knownRegions.germany,
    servingRegions: [knownRegions.calais],
  } as ShipmentRoute,
  DeToGr: {
    id: 'DeToGr',
    origin: knownRegions.germany,
    servingRegions: [knownRegions.greece],
  } as ShipmentRoute,
  DeToLb: {
    id: 'DeToLb',
    origin: knownRegions.germany,
    servingRegions: [knownRegions.lybia],
  } as ShipmentRoute,
  UkToBa: {
    id: 'UkToBa',
    origin: knownRegions.uk,
    servingRegions: [knownRegions.bosnia],
  } as ShipmentRoute,
  UkToRs: {
    id: 'UkToRs',
    origin: knownRegions.uk,
    servingRegions: [knownRegions.serbia],
  } as ShipmentRoute,
  UkToFr: {
    id: 'UkToFr',
    origin: knownRegions.uk,
    servingRegions: [knownRegions.calais],
  } as ShipmentRoute,
  UkToGr: {
    id: 'UkToGr',
    origin: knownRegions.uk,
    servingRegions: [knownRegions.greece],
  } as ShipmentRoute,
  UkToLb: {
    id: 'UkToLb',
    origin: knownRegions.uk,
    servingRegions: [knownRegions.lybia],
  } as ShipmentRoute,
} as const
