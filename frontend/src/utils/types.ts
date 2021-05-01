import _omit from 'lodash/omit'

/**
 * Returns an array with all the keys in an enum
 * @example
 * enum Status {
 *   InProgress = 'IN_PROGRESS',
 *   Complete = 'COMPLETE',
 * }
 * enumKeys(Status) // ['InProgress', 'Complete']
 */
export function enumKeys<O extends object, K extends keyof O = keyof O>(
  obj: O,
): K[] {
  return Object.keys(obj) as K[]
}

/**
 * Returns an array with the values of each key in an enum
 * @param obj
 * @returns
 * @example
 * enum Status {
 *   InProgress = 'IN_PROGRESS',
 *   Complete = 'COMPLETE',
 * }
 * enumKeys(Status) // ['IN_PROGRESS', 'COMPLETE']
 */
export function enumValues<O extends object, K extends keyof O = keyof O>(
  obj: O,
): K[] {
  return Object.values(obj) as K[]
}

/**
 * Strips the `id` and `__typename` fields from an entity
 */
export const stripIdAndTypename = <T extends object>(
  entity: T | null | undefined,
) => {
  return _omit(entity, ['id', '__typename']) as Omit<T, '__typename' | 'id'>
}
