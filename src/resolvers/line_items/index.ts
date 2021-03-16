import { ApolloError, UserInputError } from 'apollo-server'
import { has } from 'lodash'
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

  if (input.status && input.status !== lineItem.status) {
    updateAttributes.status = input.status
    updateAttributes.statusChangeTime = new Date()
  }

  if (
    has(input, 'proposedReceivingGroupId') &&
    input.proposedReceivingGroupId !== lineItem.proposedReceivingGroupId
  ) {
    if (input.proposedReceivingGroupId) {
      const group = await Group.findByPk(input.proposedReceivingGroupId)

      if (!group) {
        throw new UserInputError(
          `Group ${input.proposedReceivingGroupId} does not exist`,
        )
      }

      if (group.groupType !== GroupType.ReceivingGroup) {
        throw new UserInputError(
          `Group ${input.proposedReceivingGroupId} is not a receiving group`,
        )
      }

      updateAttributes.proposedReceivingGroupId = input.proposedReceivingGroupId
    } else {
      updateAttributes.proposedReceivingGroupId = undefined
    }
  }

  if (
    has(input, 'acceptedReceivingGroupId') &&
    input.acceptedReceivingGroupId !== lineItem.acceptedReceivingGroupId
  ) {
    if (input.acceptedReceivingGroupId) {
      const group = await Group.findByPk(input.acceptedReceivingGroupId)

      if (!group) {
        throw new UserInputError(
          `Group ${input.acceptedReceivingGroupId} does not exist`,
        )
      }

      if (group.groupType !== GroupType.ReceivingGroup) {
        throw new UserInputError(
          `Group ${input.acceptedReceivingGroupId} is not a receiving group`,
        )
      }

      updateAttributes.acceptedReceivingGroupId = input.acceptedReceivingGroupId
    } else {
      updateAttributes.acceptedReceivingGroupId = undefined
    }
  }

  // containerType: LineItemContainerType
  // category: LineItemCategory
  // description: String
  // itemCount: Int
  // boxCount: Int
  // boxWeightGrams: Int
  // lengthCm: Int
  // widthCm: Int
  // heightCm: Int
  // affirmLiability: Boolean
  // tosAccepted: Boolean
  // dangerousGoods: [DangerousGoods!]
  // photoUris: [String!]
  // sendingHubDeliveryDate: Date

  return updateAttributes
}

export { addLineItem, updateLineItem }
