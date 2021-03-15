import { ApolloError, UserInputError } from 'apollo-server'
import Offer from '../../models/offer'
import Pallet, { PalletAttributes } from '../../models/pallet'
import { MutationResolvers, PaymentStatus } from '../../server-internal-types'
import { authorizeOfferMutation } from '../offer/offer_authorization'

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

  authorizeOfferMutation(offer, context)

  return Pallet.create({
    ...input,
    paymentStatus: PaymentStatus.Uninitiated,
    paymentStatusChangeTime: new Date(),
  })
}

const getPalletWithAssociations = (id: number): Promise<Pallet | null> =>
  Pallet.findByPk(id, {
    include: {
      model: Offer,
      as: 'offer',
      include: [{ association: 'sendingGroup' }, { association: 'shipment' }],
    },
  })

const updatePallet: MutationResolvers['updatePallet'] = async (
  _,
  { id, input },
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

  authorizeOfferMutation(offer, context)

  const updateAttributes: Partial<PalletAttributes> = {}

  if (input.paymentStatus && input.paymentStatus !== pallet.paymentStatus) {
    updateAttributes.paymentStatus = input.paymentStatus
    updateAttributes.paymentStatusChangeTime = new Date()
  }

  if (input.palletType) {
    updateAttributes.palletType = input.palletType
  }

  return pallet.update(updateAttributes)
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

  authorizeOfferMutation(offer, context)

  await pallet.destroy()
  return offer
}

export { addPallet, updatePallet, destroyPallet }
