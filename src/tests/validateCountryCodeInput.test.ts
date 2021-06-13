import { Type } from '@sinclair/typebox'
import { TwoLetterCountryCode } from '../resolvers/input-validation/types'
import { validateWithJSONSchema } from '../resolvers/input-validation/validateWithJSONSchema'

describe('validate country code input', () => {
  it.each([
    ['NO', true],
    ['no', false],
    ['ZZ', false],
  ])('should validate %s as %s', (countryCode, isValid) => {
    const res = validateWithJSONSchema(
      Type.Object({
        countryCode: TwoLetterCountryCode,
      }),
    )({ countryCode })
    expect('errors' in res).toEqual(!isValid)
  })
})
