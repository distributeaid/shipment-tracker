import { Type } from '@sinclair/typebox'
import {
  Email,
  NonEmptyShortString,
  PhoneNumber,
  TwoLetterCountryCode,
  URI,
} from '../../resolvers/input-validation/types'
import { validateWithJSONSchema } from '../../resolvers/input-validation/validateWithJSONSchema'

describe('input validation types', () => {
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

  describe('phone number input', () => {
    it.each([
      ['+123456789', true],
      ['1.23.456.789', false],
      [123456789, false],
    ])('should validate %s as %s', (phoneNumber, isValid) => {
      const res = validateWithJSONSchema(
        Type.Object({
          phoneNumber: PhoneNumber,
        }),
      )({ phoneNumber })
      expect('errors' in res).toEqual(!isValid)
    })
  })

  describe('Email input', () => {
    it.each([
      ['m@distributeaid.org', true],
      ['m+extension@subdomain.distributeaid.org', true],
      ['m@localhost', false],
      ['m', false],
    ])('should validate %s as %s', (email, isValid) => {
      const res = validateWithJSONSchema(
        Type.Object({
          email: Email,
        }),
      )({ email })
      expect('errors' in res).toEqual(!isValid)
    })
  })

  describe('URI input', () => {
    it.each([
      ['http://distributeaid.org', true],
      ['https://distributeaid.org', true],
      ['https://distributeaid.org/some/resource.html', true],
      ['distributeaid.org', false],
    ])('should validate %s as %s', (uri, isValid) => {
      const res = validateWithJSONSchema(
        Type.Object({
          uri: URI,
        }),
      )({ uri })
      expect('errors' in res).toEqual(!isValid)
    })
  })

  describe('a short string input that should not be empty', () => {
    it.each([
      ['some string', true],
      ['a'.repeat(255), true],
      ['a'.repeat(256), false],
      ['', false],
      [undefined, false],
      [null, false],
    ])('should validate %s as %s', (shortString, isValid) => {
      const res = validateWithJSONSchema(
        Type.Object({
          shortString: NonEmptyShortString,
        }),
      )({ shortString })
      expect('errors' in res).toEqual(!isValid)
    })
  })
})
