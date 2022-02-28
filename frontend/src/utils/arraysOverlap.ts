import _intersection from 'lodash/intersection'

export const arraysOverlap = <T>(a: T[], b: T[]): boolean =>
  _intersection(a, b).length !== 0
