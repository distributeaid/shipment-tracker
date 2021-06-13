import { Type } from '@sinclair/typebox'
import { Email, NonEmptyShortString, PhoneNumber } from './types'

export const Contact = Type.Object({
  name: NonEmptyShortString,
  email: Type.Optional(Email),
  phone: Type.Optional(PhoneNumber),
  signal: Type.Optional(PhoneNumber),
  whatsApp: Type.Optional(PhoneNumber),
})
