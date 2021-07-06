const { setEmptyFieldsToUndefined } = require('../../src/utils/data')

test(`setEmptyFieldsToUndefined`, () => {
  expect(
    setEmptyFieldsToUndefined({
      a: '',
      b: null,
      c: undefined,
      d: 0,
      e: 'e',
    }),
  ).toEqual({ d: 0, e: 'e' })
})
