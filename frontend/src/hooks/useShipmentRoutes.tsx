import { ShipmentRoute, useAllShipmentRoutesQuery } from '../types/api-types'

export const useShipmentRoutes = (): (ShipmentRoute & { label: string })[] => {
  const { data } = useAllShipmentRoutesQuery({
    fetchPolicy: 'cache-and-network',
  })
  return (data?.shipmentRoutes ?? [])
    .map((route) => ({
      ...route,
      label: formatShipmentRouteToLabel(route),
    }))
    .sort(({ label: l1 }, { label: l2 }) => l1.localeCompare(l2))
}

/**
 * Creates a descriptive string for the given route
 */
export const formatShipmentRouteToLabel = (route: ShipmentRoute): string => {
  const { alias: fromAlias, shortName: fromName } = route.from.country
  const { alias: toAlias, shortName: toName } = route.to.country

  return `${fromAlias ?? fromName} → ${toAlias ?? toName}`
}

/**
 * Creates a short identifier for the given route
 */
export const formatShipmentRouteToID = (route: ShipmentRoute): string => {
  const { countrycode: fromCountryCode } = route.from.country
  const { countrycode: toCountryCode } = route.to.country

  return `${fromCountryCode}-${toCountryCode}`
}
