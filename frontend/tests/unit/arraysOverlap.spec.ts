import { arraysOverlap } from '../../src/utils/arraysOverlap'

test(`arraysOverlap`, () => {
  expect(arraysOverlap([1], [2])).toBeFalsy()
  expect(arraysOverlap(['a', 'b'], ['c', 'd'])).toBeFalsy()
  expect(arraysOverlap([1, 2], [])).toBeFalsy()

  expect(arraysOverlap([1, 2], [2])).toBeTruthy()
  expect(arraysOverlap([1, 2], [1, 2, 3, 4, 5])).toBeTruthy()
  expect(arraysOverlap(['a', 'b'], ['b', 'a'])).toBeTruthy()
})
