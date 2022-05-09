import { countries } from './countries'

describe('countries', () => {
  test.each(Object.entries(countries))(
    'object key %s should match countryCode of the country %s',
    (id, country) => expect(id).toEqual(country.countryCode),
  )
})
