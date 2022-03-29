import { countries, Country } from './countries'

export const getCountryByCountryCode = (search: string): Country => {
  if (search in countries) return countries[search as keyof typeof countries]
  throw new Error(`Unknown country ${search}!`)
}
