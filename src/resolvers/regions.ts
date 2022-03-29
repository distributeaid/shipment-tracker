import { knownRegions } from '../data/regions'
import { QueryResolvers } from '../server-internal-types'

export const listRegions: QueryResolvers['regions'] = async () =>
  Object.values(knownRegions)
    // Sort by locality
    .sort(({ locality: l1 }, { locality: l2 }) =>
      (l1 ?? '').localeCompare(l2 ?? ''),
    )
    // Sort by country alias or shortname
    .sort((r1, r2) =>
      (r1.country.alias ?? r1.country.shortName).localeCompare(
        r2.country.alias ?? r2.country.shortName,
      ),
    )
