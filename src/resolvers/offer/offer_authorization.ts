import { ApolloError, ForbiddenError } from 'apollo-server-express'
import { AuthenticatedContext } from '../../apolloServer'
import Offer from '../../models/offer'
import { OfferStatus, ShipmentStatus } from '../../server-internal-types'

/**
 * Asserts that an offer has a shipment and sending group.
 * Throws {@link ApolloError} if missing either
 *
 * @param {Offer} offer - the offer check consistency of
 * */
const assertAssociations = (offer: Offer): void => {
  if (!offer.sendingGroup) {
    throw new ApolloError(`Offer ${offer.id} has no sending group!`)
  }

  if (!offer.shipment) {
    throw new ApolloError(`Offer ${offer.id} has no shipment!`)
  }
}

/**
 * Asserts that the authenticated user account in {context} is either an admin or
 * the captain of the offer's sending group. Throws {@link ForbiddenError} if the
 * caller is not authorized.
 *
 * @param {Offer} offer - the offer to authorize access to
 * @param {AuthenticatedContext} context - the ApolloServer context containing auth data for the caller
 * */
const assertAccountIsCaptainOrAdmin = (
  offer: Offer,
  context: AuthenticatedContext,
): void => {
  if (
    offer.sendingGroup.captainId !== context.auth.userAccount.id &&
    !context.auth.isAdmin
  ) {
    throw new ForbiddenError('Forbidden to access this offer')
  }
}

/**
 * Asserts that the authenticated user account in {context} is authorized to mutate the offer.
 * Admins may mutate as they wish. The captain of the offer's sending group may mutate when
 * the offer has status Draft and the shipment has status Open. All other users are unauthorized.
 *
 * Throws {@link ForbiddenError} if the caller is not authorized. Throws {@link ApolloError} if the offer is missing essential assocations.
 *
 * @param {Offer} offer - the offer to authorize access to
 * @param {AuthenticatedContext} context - the ApolloServer context containing auth data for the caller
 * */
export function authorizeOfferMutation(
  offer: Offer,
  context: AuthenticatedContext,
): void {
  assertAssociations(offer)
  assertAccountIsCaptainOrAdmin(offer, context)

  if (!context.auth.isAdmin) {
    if (offer.status !== OfferStatus.Draft) {
      throw new ForbiddenError(
        'Cannot modify pallets for offer not in draft state',
      )
    }

    if (offer.shipment.status !== ShipmentStatus.Open) {
      throw new ForbiddenError(
        'Cannot modify pallets when the shipment is not open',
      )
    }
  }
}

/**
 * Asserts that the authenticated user account in {context} is authorized to view the offer.
 * Admins and captains of the offer's sending group may view. All other users are unauthorized.
 *
 * Throws {@link ForbiddenError} if the caller is not authorized. Throws {@link ApolloError} if the offer is missing essential assocations.
 *
 * @param {Offer} offer - the offer to authorize access to
 * @param {AuthenticatedContext} context - the ApolloServer context containing auth data for the caller
 * */
export function authorizeOfferQuery(
  offer: Offer,
  context: AuthenticatedContext,
): void {
  assertAssociations(offer)
  assertAccountIsCaptainOrAdmin(offer, context)
}
