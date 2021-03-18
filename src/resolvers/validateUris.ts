import { UserInputError } from 'apollo-server'
import stringIsUrl from './stringIsUrl'

export default function validateUris(uris: string[]): void {
  const invalidUris = uris.filter((uri) => !stringIsUrl(uri))

  if (invalidUris.length > 0) {
    throw new UserInputError(`Invalid URI(s): ${invalidUris.join(', ')}`)
  }
}
