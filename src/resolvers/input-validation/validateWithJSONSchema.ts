import { Static, TObject, TProperties } from '@sinclair/typebox'
import Ajv, { ErrorObject } from 'ajv'
import addFormats from 'ajv-formats'

const ajv = addFormats(new Ajv(), [
  'date-time',
  'time',
  'date',
  'email',
  'uri',
  'uuid',
])
// see https://github.com/sinclairzx81/typebox/issues/51
ajv.addKeyword('kind')
ajv.addKeyword('modifier')

export const validateWithJSONSchema = <T extends TObject<TProperties>>(
  schema: T,
): ((
  value: Record<string, any>,
) =>
  | {
      errors: ErrorObject[]
    }
  | {
      value: Static<typeof schema>
    }) => {
  const v = ajv.compile(schema)

  return (value: Record<string, any>) => {
    const valid = v(value)

    if (valid !== true) {
      return { errors: v.errors as ErrorObject[] }
    }

    return { value: value as Static<typeof schema> }
  }
}
