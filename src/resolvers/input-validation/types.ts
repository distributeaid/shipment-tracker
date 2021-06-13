/**
 * Defines re-usable types for input validation.
 */

import { Static, TSchema, Type } from '@sinclair/typebox'
import { countryCodes } from './country-codes'

export const OpenLocationCode = Type.RegEx(
  /^[23456789C][23456789CFGHJMPQRV][23456789CFGHJMPQRVWX]{6}\+[23456789CFGHJMPQRVWX]{2,3}/i,
)

export const PhoneNumber = Type.RegEx(/^\+[1-9][0-9]+$/, {
  title: 'phone number',
})

export const Email = Type.String({ format: 'email', title: 'email' })

export const URI = Type.String({ format: 'uri', title: 'URI' })

export const NonEmptyLimitedString = ({
  maxLength,
  title,
}: {
  /* Positive integer */
  maxLength: number
  title: string
}) =>
  Type.String({
    minLength: 1,
    maxLength,
    title,
  })

export const NonEmptyShortString = NonEmptyLimitedString({
  maxLength: 255,
  title: 'non-empty short string',
})

export type TwoLetterCountryCode = Static<typeof TwoLetterCountryCode>
export const TwoLetterCountryCode = Type.Union(
  countryCodes.map(({ alpha2 }) => Type.Literal(alpha2)),
  { title: 'ISO 3166 country code' },
)

export const ID = Type.Number({ minimum: 1, title: 'ID' })

/**
 * Use to denote a type that can unset by passing null instead of the value.
 */
export const ValueOrUnset = <T extends TSchema>(t: T) =>
  Type.Union([Type.Null(), t])

/**
 * Use to denote an optional type that can unset by passing null instead of the value.
 */
export const OptionalValueOrUnset = <T extends TSchema>(t: T) =>
  Type.Optional(ValueOrUnset(t))
