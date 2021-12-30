import { generatePath } from 'react-router-dom'

export const ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  SEND_VERIFICATION_TOKEN_BY_EMAIL: '/lost-password',
  SET_NEW_PASSWORD_USING_EMAIL_AND_TOKEN: '/password',
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

export function groupViewRoute(groupId: number) {
  return generatePath(ROUTES.GROUP_VIEW, { groupId: groupId.toString() })
}

export function groupEditRoute(groupId: number) {
  return generatePath(ROUTES.GROUP_EDIT, { groupId: groupId.toString() })
}

export function offerCreateRoute(shipmentId: number) {
  return generatePath(ROUTES.SHIPMENT_OFFER_CREATE, {
    shipmentId: shipmentId.toString(),
  })
}

export function offerViewRoute(shipmentId: number, offerId: number) {
  return generatePath(ROUTES.SHIPMENT_OFFER_VIEW, {
    shipmentId: shipmentId.toString(),
    offerId: offerId.toString(),
  })
}

export function shipmentViewRoute(shipmentId: number) {
  return generatePath(ROUTES.SHIPMENT_VIEW, {
    shipmentId: shipmentId.toString(),
  })
}

export function shipmentViewOffersRoute(shipmentId: number) {
  return generatePath(ROUTES.SHIPMENT_OFFER_LIST, {
    shipmentId: shipmentId.toString(),
  })
}

export function shipmentEditRoute(shipmentId: number) {
  return generatePath(ROUTES.SHIPMENT_EDIT, {
    shipmentId: shipmentId.toString(),
  })
}

export default ROUTES
