import { ApolloError, UserInputError } from 'apollo-server'
import { has, isEqual } from 'lodash'
import Group from '../../models/group'
import LineItem, { LineItemAttributes } from '../../models/line_item'
import Offer from '../../models/offer'
import {
  GroupType,
  LineItemCategory,
  LineItemContainerType,
  LineItemStatus,
  LineItemUpdateInput,
  MutationResolvers,
} from '../../server-internal-types'
import getPalletWithParentAssociations from '../getPalletWithParentAssociations'
import { authorizeOfferMutation } from '../offer/offer_authorization'
import validateUris from '../validateUris'

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
  const lineItem = await LineItem.findByPk(id, {
    include: {
      association: 'offerPallet',
      include: {
        // @ts-ignore
        model: Offer,
        as: 'offer',
        include: [{ association: 'sendingGroup' }, { association: 'shipment' }],
      },
    },
  })

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

  return lineItem.update(getUpdateAttributes(lineItem, input))
}

async function getUpdateAttributes(
  lineItem: LineItem,
  input: LineItemUpdateInput,
): Promise<Partial<LineItemAttributes>> {
  const updateAttributes: Partial<LineItemAttributes> = {}

  // TODO ensure the input status is a member of the enum
  if (input.status && input.status !== lineItem.status) {
    updateAttributes.status = input.status
    updateAttributes.statusChangeTime = new Date()
  }

  // TODO ensure the input containerType is a member of the enum
  if (input.containerType && input.containerType !== lineItem.containerType) {
    updateAttributes.containerType = input.containerType
  }

  // TODO ensure the input dangerous goods are members of the enum
  if (
    input.dangerousGoods &&
    !isEqual(input.dangerousGoods, lineItem.dangerousGoods)
  ) {
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

export { addLineItem, updateLineItem }
