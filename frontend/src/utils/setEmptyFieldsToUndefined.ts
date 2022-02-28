/**
 * Strips empty, undefined, and null fields from an object. This method is
 * intentionally NOT recursive.
 *
 * @example setEmptyFieldsToUndefined({
 *   a: "",
 *   b: null,
 *   c: 123
 * })
 * // returns { c: 123 }
 */
export function setEmptyFieldsToUndefined<T>(data: T) {
  if (typeof data === 'object') {
    const objectWithoutNulls = { ...data } as any
    Object.keys(data).forEach((key) => {
      if (objectWithoutNulls[key] == null || objectWithoutNulls[key] === '') {
        delete objectWithoutNulls[key]
      }
    })
    return objectWithoutNulls as T
  }

  return data
}
