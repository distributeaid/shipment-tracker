import { ShipmentRoute as ShipmentRouteWireFormat } from '../server-internal-types'
import { countries } from './countries'

export type Region = {
  country: typeof countries[number]['countrycode']
  locality?: string
}

export const knownRegions: Record<string, Region> = {
  calais: {
    country: 'GB',
    locality: 'Calais/Dunkirk',
  },
  paris: {
    country: 'FR',
    locality: 'Paris',
  },
  chios: {
    country: 'GR',
    locality: 'Chios',
  },
  samos: {
    country: 'GR',
    locality: 'Samos',
  },
  lesvos: {
    country: 'GR',
    locality: 'Lesvos',
  },
  northernGreece: {
    country: 'GR',
    locality: 'Thessaloniki/Northern Mainland',
  },
  southernGreece: {
    country: 'GR',
    locality: 'Athens/Southern Mainland',
  },
  beirut: {
    country: 'LB',
    locality: 'Beirut',
  },
  bekaa: {
    country: 'LB',
    locality: 'Bekaa Valley',
  },
  saida: {
    country: 'LB',
    locality: 'Saida',
  },
  lebanon: {
    country: 'LB',
    locality: 'Lebanon other',
  },
  bosnia: {
    country: 'BA',
  },
  serbia: {
    country: 'RS',
  },
  ventimiglia: {
    country: 'IT',
    locality: 'Ventimiglia',
  },
  romania: {
    country: 'RO',
  },
  poland: {
    country: 'PL',
  },
  germany: {
    country: 'DE',
  },
  uk: {
    country: 'GB',
  },
}

export type ShipmentRoute = {
  from: keyof typeof knownRegions
  to: keyof typeof knownRegions
}

export const shipmentRoutes: Record<string, ShipmentRoute> = {
  DeToBa: { from: 'germany', to: 'bosnia' },
  DeToRs: { from: 'germany', to: 'serbia' },
  DeToFr: { from: 'germany', to: 'calais' },
  DeToGr: { from: 'germany', to: 'greece' },
  DeToLb: { from: 'germany', to: 'lybia' },
  UkToBa: { from: 'uk', to: 'bosnia' },
  UkToRs: { from: 'uk', to: 'serbia' },
  UkToFr: { from: 'uk', to: 'calais' },
  UkToGr: { from: 'uk', to: 'greece' },
  UkToLb: { from: 'uk', to: 'lybia' },
} as const

export const wireFormatShipmentRoute = (
  shipmentRouteId: string,
): ShipmentRouteWireFormat => {
  // Find ShipmentRoute
  const shipmentRoute = shipmentRoutes[shipmentRouteId]
  if (shipmentRoute === undefined) {
    throw new Error(`Unknown shipment route ${shipmentRouteId}!`)
  }
  const fromCountry = countries.find(
    ({ countrycode }) => countrycode === shipmentRoute.from.country,
  )
  if (fromCountry === undefined) {
    throw new Error(
      `Unknown country ${shipmentRoute.from.country} for shipment route origin!`,
    )
  }
  const toCountry = countries.find(
    ({ countrycode }) => countrycode === shipmentRoute.to.country,
  )
  if (toCountry === undefined) {
    throw new Error(
      `Unknown country ${shipmentRoute.to.country} for shipment route destination!`,
    )
  }
  return {
    id: shipmentRouteId,
    from: {
      ...shipmentRoute.from,
      country: fromCountry,
    },
    to: {
      ...shipmentRoute.from,
      country: toCountry,
    },
  }
}
