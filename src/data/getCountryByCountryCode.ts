import { countries, Country } from './countries'

export const getCountryByCountryCode = (
  search: typeof countries[number]['countrycode'],
): Country => {
  const c = countries.find(({ countrycode }) => countrycode === search)
  if (c === undefined) throw new Error(`Unknown country ${search}!`)
  return c
}
