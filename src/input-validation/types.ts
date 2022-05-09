/**
 * Defines re-usable types for input validation.
 */

import { Static, TSchema, Type } from '@sinclair/typebox'
import { countries } from '../data/countries'
import { currencyCodes } from './currency-codes'

export const PhoneNumber = Type.RegEx(/^\+[1-9][0-9]+$/, {
  title: 'phone number',
})

export const Email = Type.String({ format: 'email', title: 'email' })

export const URI = Type.String({ format: 'uri', title: 'URI' })

export const DateTime = Type.String({ format: 'date-time', title: 'date' })

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
  Object.values(countries).map(({ countryCode }) => Type.Literal(countryCode)),
  { title: 'ISO 3166 country code' },
)

export type CurrencyCode = Static<typeof CurrencyCode>
export const CurrencyCode = Type.Union(
  currencyCodes.map(({ alpha }) => Type.Literal(alpha)),
  { title: 'ISO 4217 currency code' },
)

export const ID = Type.Integer({ minimum: 1, title: 'ID' })
export const PositiveInteger = Type.Integer({
  minimum: 1,
  title: 'positive integer',
})

export const CurrentYearOrGreater = (date?: Date) =>
  Type.Integer({
    minimum: (date ?? new Date()).getFullYear(),
  })

export const MonthIndexStartingAt1 = Type.Integer({ minimum: 1, maximum: 12 })

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

export const Pricing = Type.Optional(
  Type.Union([
    Type.Object({
      singlePallet: Type.Object({
        currency: CurrencyCode,
        quantityInMinorUnits: PositiveInteger,
      }),
    }),
    Type.Object({
      halfPallet: Type.Object({
        currency: CurrencyCode,
        quantityInMinorUnits: PositiveInteger,
      }),
    }),
  ]),
)
