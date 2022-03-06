import { countries } from '../data/countries'
import { QueryResolvers } from '../server-internal-types'

export const listCountries: QueryResolvers['countries'] = async () => [
  ...countries,
]
