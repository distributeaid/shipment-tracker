import { ApolloError, ForbiddenError } from 'apollo-server-express'
import { AuthenticatedContext } from '../../apolloServer'
import Offer from '../../models/offer'
import { OfferStatus, ShipmentStatus } from '../../server-internal-types'

const assertAssociations = (offer: Offer): void => {
  if (!offer.sendingGroup) {
    throw new ApolloError(`Offer ${offer.id} has no sending group!`)
  }

  if (!offer.shipment) {
    throw new ApolloError(`Offer ${offer.id} has no shipment!`)
  }
}

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

export function authorizeOfferQuery(
  offer: Offer,
  context: AuthenticatedContext,
): void {
  assertAssociations(offer)
  assertAccountIsCaptainOrAdmin(offer, context)
}
