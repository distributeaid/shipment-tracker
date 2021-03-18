import { UserInputError } from 'apollo-server'
import { difference } from 'lodash'

type Enum<E> = Record<keyof E, string>

export default function validateEnumMembership<E extends Enum<E>>(
  inputEnum: E,
  values: string | string[],
): void {
  values = typeof values === 'string' ? [values] : values

  const invalid: string[] = difference(values, Object.values(inputEnum))

  if (invalid.length > 0) {
    throw new UserInputError(`Invalid enum value(s): ${invalid.join(', ')}`)
  }
}
