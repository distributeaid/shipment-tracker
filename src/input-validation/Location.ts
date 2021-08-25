import { Type } from '@sinclair/typebox'
import {
  NonEmptyShortString,
  OpenLocationCode,
  TwoLetterCountryCode,
} from './types'

export const Location = Type.Object({
  townCity: NonEmptyShortString,
  countryCode: Type.Optional(TwoLetterCountryCode),
  openLocationCode: Type.Optional(OpenLocationCode),
})
