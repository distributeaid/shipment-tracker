import { knownRegions } from './regions'

describe('knownRegions', () => {
  test.each(Object.entries(knownRegions))(
    'object key %s should match the id of the region %s',
    (id, region) => expect(id).toEqual(region.id),
  )
})
