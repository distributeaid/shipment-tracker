import { Type } from '@sinclair/typebox'
import { ID } from './types'
import { validateWithJSONSchema } from './validateWithJSONSchema'

export const idInputSchema = Type.Object(
  {
    id: ID,
  },
  { additionalProperties: false },
)

/**
 * Reusable validator for requests that only contain a id parameter.
 */
export const validateIdInput = validateWithJSONSchema(idInputSchema)
