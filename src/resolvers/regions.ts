import { countries } from '../data/countries'
import { knownRegions } from '../data/shipmentRoutes'
import { QueryResolvers } from '../server-internal-types'

export const listRegions: QueryResolvers['regions'] = async () =>
  Object.entries(knownRegions)
    .map(([id, region]) => {
      const country = countries.find(
        ({ countrycode }) => countrycode === region.country,
      )
      if (country === undefined)
        throw new Error(`Unknown country ${region.country} for region ${id}!`)
      return {
        id,
        locality: region.locality,
        country,
      }
    })
    .sort(({ country: c1 }, { country: c2 }) =>
      (c1.alias ?? c1.shortName).localeCompare(c2.alias ?? c2.shortName),
    )
