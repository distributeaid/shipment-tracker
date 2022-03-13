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
          ({ countrycode }) => route.from.country === countrycode,
        ) as Country,
      },
      to: {
        ...route.to,
        country: countries.find(
          ({ countrycode }) => route.to.country === countrycode,
        ) as Country,
      },
    })),
  ]
