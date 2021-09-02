import { generatePath } from 'react-router-dom'

const ROUTES = {
  HOME: '/',
  ADMIN_ROOT: '/admin',
  APOLLO_DEMO: '/apollo-demo',
  GROUP_LIST: '/groups',
  GROUP_VIEW: '/group/:groupId',
  GROUP_CREATE: '/group/new',
  GROUP_EDIT: '/group/:groupId/edit',
  SHIPMENT_LIST: '/shipments',
  SHIPMENT_CREATE: '/shipment/new',
  SHIPMENT_VIEW: '/shipment/:shipmentId',
  SHIPMENT_OFFER_LIST: '/shipment/:shipmentId/offers',
  SHIPMENT_OFFER_CREATE: '/shipment/:shipmentId/offer/new',
  SHIPMENT_OFFER_VIEW: '/shipment/:shipmentId/offer/:offerId',
  SHIPMENT_EDIT: '/shipment/:shipmentId/edit',
  KITCHEN_SINK: '/kitchen-sink',
  FORM_DEMO: '/form-demo',
  CONFIRM_EMAIL_WITH_TOKEN: '/register/confirm',
}

export function groupViewRoute(groupId: number | string) {
  return generatePath(ROUTES.GROUP_VIEW, { groupId })
}

export function groupEditRoute(groupId: number | string) {
  return generatePath(ROUTES.GROUP_EDIT, { groupId })
}

export function offerCreateRoute(shipmentId: number | string) {
  return generatePath(ROUTES.SHIPMENT_OFFER_CREATE, { shipmentId })
}

export function offerViewRoute(
  shipmentId: number | string,
  offerId: number | string,
) {
  return generatePath(ROUTES.SHIPMENT_OFFER_VIEW, { shipmentId, offerId })
}

export function shipmentViewRoute(shipmentId: number | string) {
  return generatePath(ROUTES.SHIPMENT_VIEW, { shipmentId })
}

export function shipmentViewOffersRoute(shipmentId: number | string) {
  return generatePath(ROUTES.SHIPMENT_OFFER_LIST, { shipmentId })
}

export function shipmentEditRoute(shipmentId: number | string) {
  return generatePath(ROUTES.SHIPMENT_EDIT, { shipmentId })
}

export default ROUTES
