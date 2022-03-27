const setMatchingFieldsToUndefined =
  (isMatching: (v: any) => boolean) =>
  <T>(data: T) => {
    if (typeof data === 'object') {
      const objectWithouMatching = { ...data } as any
      Object.keys(data).forEach((key) => {
        const v = objectWithouMatching[key]
        if (isMatching(v)) {
          delete objectWithouMatching[key]
        }
      })
      return objectWithouMatching as T
    }

    return data
  }

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
export const setEmptyFieldsToUndefined = setMatchingFieldsToUndefined(
  (v) => v == null || v === '',
)

export const setNaNFieldsToUndefined = setMatchingFieldsToUndefined(isNaN)
