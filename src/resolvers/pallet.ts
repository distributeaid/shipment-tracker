import { ApolloError, UserInputError } from 'apollo-server'
import LineItem from '../models/line_item'
import Offer from '../models/offer'
import Pallet, { PalletAttributes } from '../models/pallet'
import {
  MutationResolvers,
  PalletResolvers,
  PalletType,
  PaymentStatus,
  QueryResolvers,
} from '../server-internal-types'
import getPalletWithParentAssociations from './getPalletWithParentAssociations'
import {
  authorizeOfferMutation,
  authorizeOfferQuery,
} from './offer_authorization'
import validateEnumMembership from './validateEnumMembership'

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

  if (input.palletType) {
    validateEnumMembership(PalletType, input.palletType)
  }

  return Pallet.create({
    ...input,
    paymentStatus: PaymentStatus.Uninitiated,
    paymentStatusChangeTime: new Date(),
  })
}

const updatePallet: MutationResolvers['updatePallet'] = async (
  _,
  { id, input },
  context,
) => {
  const pallet = await getPalletWithParentAssociations(id)

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
    validateEnumMembership(PaymentStatus, input.paymentStatus)
    updateAttributes.paymentStatus = input.paymentStatus
    updateAttributes.paymentStatusChangeTime = new Date()
  }

  if (input.palletType) {
    validateEnumMembership(PalletType, input.palletType)
    updateAttributes.palletType = input.palletType
  }

  return pallet.update(updateAttributes)
}

const pallet: QueryResolvers['pallet'] = async (_, { id }, context) => {
  const pallet = await getPalletWithParentAssociations(id)

  if (!pallet) {
    throw new UserInputError(`Pallet ${id} does not exist`)
  }

  const offer = pallet.offer

  if (!offer) {
    throw new ApolloError(`Pallet ${pallet.offerId} has no offer!`)
  }

  authorizeOfferQuery(offer, context)

  return pallet
}

const destroyPallet: MutationResolvers['destroyPallet'] = async (
  _,
  { id },
  context,
) => {
  const pallet = await getPalletWithParentAssociations(id)

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

const palletLineItems: PalletResolvers['lineItems'] = async (parent) => {
  return LineItem.findAll({ where: { offerPalletId: parent.id } })
}

export { addPallet, updatePallet, destroyPallet, palletLineItems, pallet }
