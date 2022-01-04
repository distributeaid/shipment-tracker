import { generatePath } from 'react-router-dom'

const SHIPMENT_ID_ROOT = '/shipment/:shipmentId'

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
  SHIPMENT_EDIT: SHIPMENT_ID_ROOT + '/edit',
  SHIPMENT_OFFER_CREATE: SHIPMENT_ID_ROOT + '/offer/new',
  SHIPMENT_OFFER_VIEW: SHIPMENT_ID_ROOT + '/offer/:offerId',
  // React Router v6 introduced the concept of nested routes,
  // which does not support using absolute pathes in nested routes
  // (see https://github.com/remix-run/react-router/issues/8035).
  // Therefore we need to be able to use relative paths for the route
  // definition of those routes that are nested.
  SHIPMENT: {
    $: SHIPMENT_ID_ROOT + '/*',
    VIEW: 'details',
    OFFER_LIST: 'offers',
  },
  KITCHEN_SINK: '/kitchen-sink',
  FORM_DEMO: '/form-demo',
  CONFIRM_EMAIL_WITH_TOKEN: '/register/confirm',
}

export const groupViewRoute = (groupId: number): string =>
  generatePath(ROUTES.GROUP_VIEW, { groupId: groupId.toString() })

export const groupEditRoute = (groupId: number): string =>
  generatePath(ROUTES.GROUP_EDIT, { groupId: groupId.toString() })

export const offerCreateRoute = (shipmentId: number): string =>
  generatePath(ROUTES.SHIPMENT_OFFER_CREATE, {
    shipmentId: shipmentId.toString(),
  })

export const offerViewRoute = (shipmentId: number, offerId: number): string =>
  generatePath(ROUTES.SHIPMENT_OFFER_VIEW, {
    shipmentId: shipmentId.toString(),
    offerId: offerId.toString(),
  })

export const shipmentViewRoute = (shipmentId: number): string =>
  generatePath(SHIPMENT_ID_ROOT + '/' + ROUTES.SHIPMENT.VIEW, {
    shipmentId: shipmentId.toString(),
  })

export const shipmentViewOffersRoute = (shipmentId: number): string =>
  generatePath(SHIPMENT_ID_ROOT + '/' + ROUTES.SHIPMENT.OFFER_LIST, {
    shipmentId: shipmentId.toString(),
  })

export const shipmentEditRoute = (shipmentId: number): string =>
  generatePath(ROUTES.SHIPMENT_EDIT, {
    shipmentId: shipmentId.toString(),
  })

export default ROUTES
