import { shipmentRoutes } from './shipmentRoutes'

describe('shipmentRoutes', () => {
  test.each(Object.entries(shipmentRoutes))(
    'object key %s should match the id of the shipment route %s',
    (id, route) => expect(id).toEqual(route.id),
  )
  test.each(Object.values(shipmentRoutes))(
    'to on %j should be defined',
    (route) => expect(route.to).not.toBeUndefined(),
  )
  test.each(Object.values(shipmentRoutes))(
    'from on %j should be defined',
    (route) => expect(route.from).not.toBeUndefined(),
  )
})
