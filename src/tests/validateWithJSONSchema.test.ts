import { Type } from '@sinclair/typebox'
import { validateWithJSONSchema } from '../resolvers/input-validation/validateWithJSONSchema'

describe('validateWithJSONSchema', () => {
  it('should validate input against a JSON schema', () => {
    expect(
      validateWithJSONSchema(
        Type.Object({
          foo: Type.String({ minLength: 1 }),
        }),
      )({ foo: 'bar' }),
    ).toEqual({
      value: { foo: 'bar' },
      errors: undefined,
    })
  })

  it('should return errors if input does not match the JSON schema', () => {
    expect(
      validateWithJSONSchema(
        Type.Object({
          foo: Type.String({ minLength: 1 }),
        }),
      )({ bar: 'baz' }),
    ).toEqual({
      value: undefined,
      errors: [
        {
          instancePath: '',
          keyword: 'required',
          message: "must have required property 'foo'",
          params: {
            missingProperty: 'foo',
          },
          schemaPath: '#/required',
        },
      ],
    })
  })
})
