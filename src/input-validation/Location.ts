import { Type } from '@sinclair/typebox'
import {
  NonEmptyShortString,
  OpenLocationCode,
  TwoLetterCountryCode,
} from './types'

export const Location = Type.Object({
  townCity: NonEmptyShortString,
  country: Type.Optional(TwoLetterCountryCode),
  openLocationCode: Type.Optional(OpenLocationCode),
})
