const ROUTES = {
  HOME: '/',
  ADMIN_ROOT: '/admin',
  APOLLO_DEMO: '/apollo-demo',
  GROUP_LIST: '/groups',
  GROUP_VIEW: '/group/:groupId',
  GROUP_CREATE: '/group/new',
  GROUP_EDIT: '/group/:groupId/edit',
  SHIPMENT_LIST: '/shipments',
  SHIPMENT_EDIT: '/shipment/:shipmentId/edit',
  KITCHEN_SINK: '/kitchen-sink',
}

export function groupViewRoute(groupId: number | string) {
  return ROUTES.GROUP_VIEW.replace(':groupId', groupId.toString())
}

export function groupEditRoute(groupId: number | string) {
  return ROUTES.GROUP_EDIT.replace(':groupId', groupId.toString())
}

export function shipmentEditRoute(shipmentId: number | string) {
  return ROUTES.SHIPMENT_EDIT.replace(':shipmentId', shipmentId.toString())
}

export default ROUTES
