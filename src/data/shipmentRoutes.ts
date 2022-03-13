import { countries } from './countries'

export type ShipmentRoute = {
  id: string
  from: { country: typeof countries[number]['countrycode']; region?: string }
  to: { country: typeof countries[number]['countrycode']; region?: string }
}

export const shipmentRoutes: ShipmentRoute[] = [
  { id: 'DeToBa', from: { country: 'DE' }, to: { country: 'BA' } },
  { id: 'DeToRs', from: { country: 'DE' }, to: { country: 'RS' } },
  { id: 'DeToFr', from: { country: 'DE' }, to: { country: 'FR' } },
  { id: 'DeToGr', from: { country: 'DE' }, to: { country: 'GR' } },
  { id: 'DeToLb', from: { country: 'DE' }, to: { country: 'LB' } },
  { id: 'UkToBa', from: { country: 'GB' }, to: { country: 'BA' } },
  { id: 'UkToRs', from: { country: 'GB' }, to: { country: 'RS' } },
  { id: 'UkToFr', from: { country: 'GB' }, to: { country: 'FR' } },
  { id: 'UkToGr', from: { country: 'GB' }, to: { country: 'GR' } },
  { id: 'UkToLb', from: { country: 'GB' }, to: { country: 'LB' } },
]

export const wireFormatShipmentRoute = (shipmentRouteId: string) => {
  // Find ShipmentRoute
  const shipmentRoute = shipmentRoutes.find(({ id }) => shipmentRouteId === id)
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
    ...shipmentRoute,
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
