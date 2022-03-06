import { countries, Country } from '../data/countries'
import { shipmentRoutes } from '../data/shipmentRoutes'
import { QueryResolvers } from '../server-internal-types'

export const listShipmentRoutes: QueryResolvers['shipmentRoutes'] =
  async () => [
    ...shipmentRoutes.map((route) => ({
      ...route,
      from: {
        ...route.from,
        country: countries.find(
          ({ alpha2 }) => route.from.country === alpha2,
        ) as Country,
      },
      to: {
        ...route.to,
        country: countries.find(
          ({ alpha2 }) => route.to.country === alpha2,
        ) as Country,
      },
    })),
  ]
