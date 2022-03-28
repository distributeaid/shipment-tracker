import { Type } from '@sinclair/typebox'
import { NonEmptyShortString, TwoLetterCountryCode } from './types'

export const Location = Type.Object({
  city: NonEmptyShortString,
  country: Type.Optional(TwoLetterCountryCode),
})
