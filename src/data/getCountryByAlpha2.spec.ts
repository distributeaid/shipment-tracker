import { countries } from './countries'
import { getCountryByCountryCode } from './getCountryByCountryCode'

describe('getCountryByCountryCode()', () => {
  it(`should return a country by it's two letter code`, () =>
    expect(getCountryByCountryCode('NO')).toEqual(
      countries.find(({ countrycode }) => countrycode === 'NO'),
    ))
})
