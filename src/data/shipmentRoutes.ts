import { knownRegions, Region } from './regions'

export type ShipmentRoute = {
  id: string
  from: Region
  to: Region
}

// TODO: turn `to` in a list of servingRegions
export const shipmentRoutes: Record<string, ShipmentRoute> = {
  DeToBa: { id: 'DeToBa', from: knownRegions.germany, to: knownRegions.bosnia },
  DeToRs: { id: 'DeToRs', from: knownRegions.germany, to: knownRegions.serbia },
  DeToFr: { id: 'DeToFr', from: knownRegions.germany, to: knownRegions.calais },
  DeToGr: { id: 'DeToGr', from: knownRegions.germany, to: knownRegions.greece },
  DeToLb: { id: 'DeToLb', from: knownRegions.germany, to: knownRegions.lybia },
  UkToBa: { id: 'UkToBa', from: knownRegions.uk, to: knownRegions.bosnia },
  UkToRs: { id: 'UkToRs', from: knownRegions.uk, to: knownRegions.serbia },
  UkToFr: { id: 'UkToFr', from: knownRegions.uk, to: knownRegions.calais },
  UkToGr: { id: 'UkToGr', from: knownRegions.uk, to: knownRegions.greece },
  UkToLb: { id: 'UkToLb', from: knownRegions.uk, to: knownRegions.lybia },
} as const
