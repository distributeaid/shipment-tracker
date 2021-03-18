import { ApolloError, UserInputError } from 'apollo-server'
import { has, isEqual } from 'lodash'
import { AuthenticatedContext } from '../apolloServer'
import Group from '../models/group'
import LineItem, { LineItemAttributes } from '../models/line_item'
import Offer from '../models/offer'
import Pallet from '../models/pallet'
import {
  DangerousGoods,
  GroupType,
  LineItemCategory,
  LineItemContainerType,
  LineItemStatus,
  LineItemUpdateInput,
  MutationResolvers,
} from '../server-internal-types'
import getPalletWithParentAssociations from './getPalletWithParentAssociations'
import { authorizeOfferMutation } from './offer_authorization'
import validateEnumMembership from './validateEnumMembership'
import validateUris from './validateUris'

const addLineItem: MutationResolvers['addLineItem'] = async (
  _,
  { palletId },
  context,
) => {
  const pallet = await getPalletWithParentAssociations(palletId)

  if (!pallet) {
    throw new UserInputError(`Pallet ${palletId} does not exist`)
  }

  if (!pallet?.offer) {
    throw new ApolloError(`Pallet ${palletId} has no offer!`)
  }

  authorizeOfferMutation(pallet.offer, context)

  await LineItem.create({
    offerPalletId: palletId,
    status: LineItemStatus.Proposed,
    containerType: LineItemContainerType.Unset,
    category: LineItemCategory.Unset,
    itemCount: 0,
    affirmLiability: false,
    tosAccepted: false,
    dangerousGoods: [],
    photoUris: [],
    statusChangeTime: new Date(),
  })

  return pallet
}

const updateLineItem: MutationResolvers['updateLineItem'] = async (
  _,
  { id, input },
  context,
) => {
  const maybeLineItem = await getLineItemWithParentAssociations(id)
  const lineItem = await authorizeLineItemMutation(id, maybeLineItem, context)

  return lineItem.update(await getUpdateAttributes(lineItem, input))
}

async function authorizeLineItemMutation(
  id: number,
  lineItem: LineItem | null,
  context: AuthenticatedContext,
): Promise<LineItem> {
  if (!lineItem) {
    throw new UserInputError(`LineItem ${id} does not exist`)
  }

  if (!lineItem.offerPallet) {
    throw new UserInputError(`Pallet ${lineItem.offerPalletId} does not exist`)
  }

  if (!lineItem.offerPallet.offer) {
    throw new ApolloError(`Pallet ${lineItem.offerPalletId} has no offer!`)
  }

  authorizeOfferMutation(lineItem.offerPallet.offer, context)

  return lineItem
}

async function getUpdateAttributes(
  lineItem: LineItem,
  input: LineItemUpdateInput,
): Promise<Partial<LineItemAttributes>> {
  const updateAttributes: Partial<LineItemAttributes> = {}

  if (input.status && input.status !== lineItem.status) {
    validateEnumMembership(LineItemStatus, input.status)
    updateAttributes.status = input.status
    updateAttributes.statusChangeTime = new Date()
  }

  if (input.containerType && input.containerType !== lineItem.containerType) {
    validateEnumMembership(LineItemContainerType, input.containerType)
    updateAttributes.containerType = input.containerType
  }

  if (
    input.dangerousGoods &&
    !isEqual(input.dangerousGoods, lineItem.dangerousGoods)
  ) {
    validateEnumMembership(DangerousGoods, input.dangerousGoods)
    updateAttributes.dangerousGoods = input.dangerousGoods
  }

  await updateGroupIdAttr(
    lineItem,
    input,
    updateAttributes,
    'proposedReceivingGroupId',
  )
  await updateGroupIdAttr(
    lineItem,
    input,
    updateAttributes,
    'acceptedReceivingGroupId',
  )

  const commonScalarAttributes: Array<
    keyof LineItemAttributes & keyof LineItemUpdateInput
  > = [
    'description',
    'itemCount',
    'containerCount',
    'containerWeightGrams',
    'containerLengthCm',
    'containerWidthCm',
    'containerHeightCm',
    'affirmLiability',
    'tosAccepted',
    'sendingHubDeliveryDate',
  ]

  commonScalarAttributes.forEach((attr) => {
    if (has(input, attr)) {
      updateAttributes[attr] = input[attr] || undefined
    }
  })

  if (has(input, 'photoUris')) {
    const uris = input.photoUris || []
    validateUris(uris)
    updateAttributes.photoUris = uris
  }

  return updateAttributes
}

async function updateGroupIdAttr(
  lineItem: LineItem,
  input: LineItemUpdateInput,
  updateAttributes: Partial<LineItemAttributes>,
  attr: 'acceptedReceivingGroupId' | 'proposedReceivingGroupId',
) {
  if (
    !has(input, 'acceptedReceivingGroupId') ||
    input[attr] === lineItem[attr]
  ) {
    return
  }

  if (!input[attr]) {
    updateAttributes[attr] = undefined
    return
  }

  const group = await Group.findByPk(input[attr]!)

  if (!group) {
    throw new UserInputError(`Group ${input[attr]} does not exist`)
  }

  if (group.groupType !== GroupType.ReceivingGroup) {
    throw new UserInputError(`Group ${input[attr]} is not a receiving group`)
  }

  updateAttributes[attr] = input[attr]!
}

async function getLineItemWithParentAssociations(id: number) {
  return LineItem.findByPk(id, {
    include: {
      association: 'offerPallet',
      include: {
        // The need for ts-ignore here seems to be a bug in sequelize-typescript. There
        // are several open issues related to bad type errors on the project so hopefully
        // it will be fixed in an upcoming version. --bion, 3/17/21
        // @ts-ignore
        model: Offer,
        as: 'offer',
        include: [{ association: 'sendingGroup' }, { association: 'shipment' }],
      },
    },
  })
}

const destroyLineItem: MutationResolvers['destroyLineItem'] = async (
  _,
  { id },
  context,
) => {
  const maybeLineItem: LineItem | null = await getLineItemWithParentAssociations(
    id,
  )

  const lineItem: LineItem = await authorizeLineItemMutation(
    id,
    maybeLineItem,
    context,
  )

  const pallet = lineItem.offerPallet
  await lineItem.destroy()

  return pallet
}

const moveLineItem: MutationResolvers['moveLineItem'] = async (
  _,
  { id, targetPalletId },
  context,
) => {
  const maybeLineItem = getLineItemWithParentAssociations(id)
  const targetPalletPromise = Pallet.findByPk(targetPalletId)

  const lineItemPromise = authorizeLineItemMutation(
    id,
    await maybeLineItem,
    context,
  )

  const targetPallet = await targetPalletPromise

  if (!targetPallet) {
    throw new UserInputError(`Pallet ${targetPalletId} does not exist`)
  }

  const lineItem = await lineItemPromise
  if (targetPallet.offerId !== lineItem.offerPallet.offerId) {
    throw new UserInputError(
      `Target pallet ${targetPalletId} is not in the same offer`,
    )
  }

  await lineItem.update({ offerPalletId: targetPalletId })

  return lineItem.offerPallet.offer
}

export { addLineItem, updateLineItem, destroyLineItem, moveLineItem }
