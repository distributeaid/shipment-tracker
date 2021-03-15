import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import { AuthenticatedContext } from '../../apolloServer'
import Offer from '../../models/offer'
import Pallet from '../../models/pallet'
import {
  MutationResolvers,
  OfferStatus,
  PaymentStatus,
  ShipmentStatus,
} from '../../server-internal-types'

const validatePalletMutation = (
  offer: Offer,
  context: AuthenticatedContext,
): void => {
  if (!offer.sendingGroup) {
    throw new ApolloError(`Offer ${offer.id} has no sending group!`)
  }

  if (!offer.shipment) {
    throw new ApolloError(`Offer ${offer.id} has no shipment!`)
  }

  if (
    offer.sendingGroup.captainId !== context.auth.userAccount.id &&
    !context.auth.isAdmin
  ) {
    throw new ForbiddenError('Forbidden to modify pallets for this offer')
  }

  if (offer.status !== OfferStatus.Draft) {
    throw new ForbiddenError(
      'Cannot modify pallets for offer not in draft state',
    )
  }

  if (!context.auth.isAdmin && offer.shipment.status !== ShipmentStatus.Open) {
    throw new ForbiddenError('The shipment for this pallet is not open')
  }
}

const addPallet: MutationResolvers['addPallet'] = async (
  _,
  { input },
  context,
) => {
  const offer = await Offer.findByPk(input.offerId, {
    include: [{ association: 'sendingGroup' }, { association: 'shipment' }],
  })

  if (!offer) {
    throw new UserInputError(`Offer ${input.offerId} does not exist`)
  }

  validatePalletMutation(offer, context)

  return Pallet.create({ ...input, paymentStatus: PaymentStatus.Uninitiated })
}

const getPalletWithAssociations = (id: number): Promise<Pallet | null> =>
  Pallet.findByPk(id, {
    include: {
      model: Offer,
      as: 'Offers',
      include: [{ association: 'sendingGroup' }, { association: 'shipment' }],
    },
  })

const updatePallet: MutationResolvers['updatePallet'] = async (
  _,
  { input },
  context,
) => {
  const pallet = await getPalletWithAssociations(input.id)

  if (!pallet) {
    throw new UserInputError(`Pallet ${input.id} does not exist`)
  }

  const offer = pallet.offer

  if (!offer) {
    throw new ApolloError(`Pallet ${pallet.offerId} has no offer!`)
  }

  validatePalletMutation(offer, context)

  return pallet.update(input)
}

const destroyPallet: MutationResolvers['destroyPallet'] = async (
  _,
  { id },
  context,
) => {
  const pallet = await getPalletWithAssociations(id)

  if (!pallet) {
    throw new UserInputError(`Pallet ${id} does not exist`)
  }

  const offer = pallet.offer

  if (!offer) {
    throw new ApolloError(`Pallet ${pallet.offerId} has no offer!`)
  }

  validatePalletMutation(offer, context)

  await pallet.destroy()

  return offer.reload({ include: 'pallets' })
}

export { addPallet, updatePallet, destroyPallet }
