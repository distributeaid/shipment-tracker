import { Type } from '@sinclair/typebox'
import { ErrorObject } from 'ajv'
import { errorsToProblemDetails } from '../../resolvers/input-validation/errorsToProblemDetails'
import {
  NonEmptyShortString,
  URI,
} from '../../resolvers/input-validation/types'
import { validateWithJSONSchema } from '../../resolvers/input-validation/validateWithJSONSchema'

describe('errorsToProblemDetails() should turn validation errors into Problem Details for HTTP APIs (RFC7807)', () => {
  it('should format an unknown property in the top-level object', () => {
    const valid = validateWithJSONSchema(Type.Object({}))({
      extraField: 'not allowed',
    })
    expect(
      errorsToProblemDetails(
        (valid as {
          errors: ErrorObject[]
        }).errors,
      ),
    ).toEqual([
      {
        title: 'Input validation failed',
        status: 400,
        detail:
          'The provided input JSON contained an unexpected property name "extraField" in the top-level.',
      },
    ])
  })

  it('should format an unknown property int a child object', () => {
    const valid = validateWithJSONSchema(
      Type.Object({
        contact: Type.Object({
          properties: Type.Object({}),
        }),
      }),
    )({
      contact: {
        properties: { extraField: 'not allowed' },
      },
    })
    expect(
      errorsToProblemDetails(
        (valid as {
          errors: ErrorObject[]
        }).errors,
      ),
    ).toEqual([
      {
        title: 'Input validation failed',
        status: 400,
        detail:
          'The provided input JSON contained an unexpected property name "extraField" in "/contact/properties".',
      },
    ])
  })

  describe('it should format schema errors', () => {
    test('string maxlength', () => {
      const valid = validateWithJSONSchema(
        Type.Object({ name: NonEmptyShortString }),
      )({
        name: 'My long group name, oh YEAH' + '!'.repeat(250),
      })
      expect(
        errorsToProblemDetails(
          (valid as {
            errors: ErrorObject[]
          }).errors,
        ),
      ).toEqual([
        {
          title: 'Input validation failed',
          status: 400,
          detail: `The value provided for "/name" was invalid: it must NOT have more than 255 characters.`,
        },
      ])
    })

    test('Array of URIs', () => {
      const valid = validateWithJSONSchema(
        Type.Object({ photoUris: Type.Array(URI) }),
      )({
        photoUris: ['one', 'www.example.com'],
      })
      expect(
        errorsToProblemDetails(
          (valid as {
            errors: ErrorObject[]
          }).errors,
        ),
      ).toEqual([
        {
          title: 'Input validation failed',
          status: 400,
          detail:
            'The value provided for "/photoUris/0" was invalid: it must match format "uri".',
        },
      ])
    })
  })
})
