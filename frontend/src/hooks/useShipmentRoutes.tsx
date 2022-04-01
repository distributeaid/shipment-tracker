import {
  Region,
  ShipmentRoute,
  useAllShipmentRoutesQuery,
} from '../types/api-types'

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

const formatRegion = ({ country: { alias, shortName } }: Region): string =>
  alias ?? shortName

const formatShipmentRouteServingRegionsToLabel = (
  route: Pick<ShipmentRoute, 'servingRegions'>,
): string => route.servingRegions.map(formatRegion).join(', ')

/**
 * Creates a descriptive string for the given route
 */
export const formatShipmentRouteToLabel = (
  route: Pick<ShipmentRoute, 'origin' | 'servingRegions'>,
): string =>
  `${formatRegion(route.origin)} → ${formatShipmentRouteServingRegionsToLabel(
    route,
  )}`

/**
 * Creates a short identifier for the given route
 */
export const formatShipmentRouteToID = (route: ShipmentRoute): string =>
  `${route.origin.country.countryCode}-${route.servingRegions
    .map(({ country }) => country.countryCode)
    .join('+')}`
