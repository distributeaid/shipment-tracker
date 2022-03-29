import { countries } from './countries'
import { getCountryByCountryCode } from './getCountryByCountryCode'

describe('getCountryByCountryCode()', () => {
  it(`should return a country by it's two letter code`, () =>
    expect(getCountryByCountryCode('NO')).toEqual(countries.NO))
  it(`should throw an exception if countryCode is not known`, () =>
    expect(() => getCountryByCountryCode('00')).toThrow(`Unknown country 00!`))
})
