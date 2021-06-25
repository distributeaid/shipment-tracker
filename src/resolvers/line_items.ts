import { Static, Type } from '@sinclair/typebox'
import { ApolloError, UserInputError } from 'apollo-server'
import { isEqual } from 'lodash'
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
  LineItemResolvers,
  LineItemStatus,
  MutationResolvers,
  QueryResolvers,
} from '../server-internal-types'
import getPalletWithParentAssociations from './getPalletWithParentAssociations'
import { validateIdInput } from './input-validation/idInputSchema'
import {
  DateTime,
  ID,
  NonEmptyShortString,
  PositiveInteger,
  URI,
} from './input-validation/types'
import { validateWithJSONSchema } from './input-validation/validateWithJSONSchema'
import {
  authorizeOfferMutation,
  authorizeOfferQuery,
} from './offer_authorization'

// Line item mutation resolvers

// - get line item

const lineItem: QueryResolvers['lineItem'] = async (_, { id }, context) => {
  const lineItem = await getLineItemWithParentAssociations(id)
  if (lineItem === null) {
    throw new UserInputError(`Line item ${id} does not exist`)
  }

  const pallet = lineItem.offerPallet
  if (pallet === null) {
    throw new UserInputError(`LineItem ${id} has no pallet!`)
  }

  authorizeOfferQuery(pallet.offer, context)

  return lineItem
}

// - add new line item

const addLineItem: MutationResolvers['addLineItem'] = async (
  _,
  { palletId },
  context,
) => {
  const valid = validateIdInput({ id: palletId })
  if ('errors' in valid) {
    throw new UserInputError('Line item arguments invalid', valid.errors)
  }

  const pallet = await getPalletWithParentAssociations(valid.value.id)

  if (pallet === null) {
    throw new UserInputError(`Pallet ${valid.value.id} does not exist`)
  }

  if (pallet.offer === null) {
    throw new ApolloError(`Pallet ${valid.value.id} has no offer!`)
  }

  authorizeOfferMutation(pallet.offer, context)

  return LineItem.create({
    offerPalletId: valid.value.id,
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
}

// - update line item

const updateLineItemInput = Type.Object(
  {
    id: ID,
    input: Type.Object(
      {
        status: Type.Optional(Type.Enum(LineItemStatus)),
        proposedReceivingGroupId: Type.Optional(ID),
        acceptedReceivingGroupId: Type.Optional(ID),
        containerType: Type.Optional(Type.Enum(LineItemContainerType)),
        category: Type.Optional(Type.Enum(LineItemCategory)),
        description: Type.Optional(NonEmptyShortString),
        itemCount: Type.Optional(PositiveInteger),
        containerCount: Type.Optional(PositiveInteger),
        containerWeightGrams: Type.Optional(PositiveInteger),
        containerLengthCm: Type.Optional(PositiveInteger),
        containerWidthCm: Type.Optional(PositiveInteger),
        containerHeightCm: Type.Optional(PositiveInteger),
        affirmLiability: Type.Optional(Type.Boolean()),
        tosAccepted: Type.Optional(Type.Boolean()),
        dangerousGoods: Type.Optional(Type.Array(Type.Enum(DangerousGoods))),
        photoUris: Type.Optional(Type.Array(URI)),
        sendingHubDeliveryDate: Type.Optional(DateTime),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
)

const validateUpdateLineItemInput = validateWithJSONSchema(updateLineItemInput)

const updateLineItem: MutationResolvers['updateLineItem'] = async (
  _,
  input,
  context,
) => {
  const valid = validateUpdateLineItemInput(input)
  if ('errors' in valid) {
    throw new UserInputError('Update line item arguments invalid', valid.errors)
  }

  const maybeLineItem = await getLineItemWithParentAssociations(valid.value.id)
  const lineItem = await authorizeLineItemMutation(
    valid.value.id,
    maybeLineItem,
    context,
  )

  return lineItem.update(await getUpdateAttributes(lineItem, valid.value.input))
}

async function authorizeLineItemMutation(
  id: number,
  lineItem: LineItem | null,
  context: AuthenticatedContext,
): Promise<LineItem> {
  if (!lineItem) {
    throw new UserInputError(`LineItem ${id} does not exist`)
  }

  if (lineItem.offerPallet === null) {
    throw new UserInputError(`Pallet ${lineItem.offerPalletId} does not exist`)
  }

  if (lineItem.offerPallet.offer === null) {
    throw new ApolloError(`Pallet ${lineItem.offerPalletId} has no offer!`)
  }

  authorizeOfferMutation(lineItem.offerPallet.offer, context)

  return lineItem
}

async function getUpdateAttributes(
  lineItem: LineItem,
  input: Static<typeof updateLineItemInput>['input'],
): Promise<Partial<LineItemAttributes>> {
  const updateAttributes: Partial<LineItemAttributes> = {}

  if (input.status !== undefined && input.status !== lineItem.status) {
    updateAttributes.status = input.status
    updateAttributes.statusChangeTime = new Date()
  }

  if (
    input.containerType !== undefined &&
    input.containerType !== lineItem.containerType
  ) {
    updateAttributes.containerType = input.containerType
  }

  if (input.category !== undefined && input.category != lineItem.category) {
    updateAttributes.category = input.category
  }

  if (
    input.dangerousGoods !== undefined &&
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

  if (input.description !== undefined) {
    updateAttributes.description = input.description
  }

  if (input.itemCount !== undefined) {
    updateAttributes.itemCount = input.itemCount
  }

  if (input.containerCount !== undefined) {
    updateAttributes.containerCount = input.containerCount
  }

  if (input.containerWeightGrams !== undefined) {
    updateAttributes.containerWeightGrams = input.containerWeightGrams
  }

  if (input.containerLengthCm !== undefined) {
    updateAttributes.containerLengthCm = input.containerLengthCm
  }

  if (input.containerWidthCm !== undefined) {
    updateAttributes.containerWidthCm = input.containerWidthCm
  }

  if (input.containerHeightCm !== undefined) {
    updateAttributes.containerHeightCm = input.containerHeightCm
  }

  if (input.affirmLiability !== undefined) {
    updateAttributes.affirmLiability = input.affirmLiability
  }

  if (input.tosAccepted !== undefined) {
    updateAttributes.tosAccepted = input.tosAccepted
  }

  if (input.sendingHubDeliveryDate !== undefined) {
    updateAttributes.sendingHubDeliveryDate = new Date(
      input.sendingHubDeliveryDate,
    )
  }

  if (input.photoUris !== undefined) {
    updateAttributes.photoUris = input.photoUris
  }

  return updateAttributes
}

async function updateGroupIdAttr(
  lineItem: LineItem,
  input: Static<typeof updateLineItemInput>['input'],
  updateAttributes: Partial<LineItemAttributes>,
  attr: 'acceptedReceivingGroupId' | 'proposedReceivingGroupId',
) {
  if (
    !('acceptedReceivingGroupId' in input) ||
    input[attr] === lineItem[attr]
  ) {
    return
  }

  if (input[attr] === undefined) {
    updateAttributes[attr] = undefined
    return
  }

  const group = await Group.findByPk(input[attr])

  if (!group) {
    throw new UserInputError(`Group ${input[attr]} does not exist`)
  }

  if (group.groupType !== GroupType.ReceivingGroup) {
    throw new UserInputError(`Group ${input[attr]} is not a receiving group`)
  }

  updateAttributes[attr] = input[attr]
}

async function getLineItemWithParentAssociations(
  id: number,
): Promise<(LineItem & { offerPallet: Pallet | null }) | null> {
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

// - delete line item

const destroyLineItem: MutationResolvers['destroyLineItem'] = async (
  _,
  { id },
  context,
) => {
  const valid = validateIdInput({ id })
  if ('errors' in valid) {
    throw new UserInputError('Destroy line item input invalid', valid.errors)
  }

  const maybeLineItem = await getLineItemWithParentAssociations(valid.value.id)
  if (maybeLineItem === null) {
    throw new UserInputError(`Line item ${id} does not exist`)
  }

  const lineItem = await authorizeLineItemMutation(
    valid.value.id,
    maybeLineItem,
    context,
  )

  const pallet = lineItem.offerPallet
  await lineItem.destroy()

  return pallet
}

// - move line item

const moveLineItemInput = Type.Object(
  {
    id: ID,
    targetPalletId: ID,
  },
  { additionalProperties: false },
)

const validateMoveLineItemInput = validateWithJSONSchema(moveLineItemInput)

const moveLineItem: MutationResolvers['moveLineItem'] = async (
  _,
  input,
  context,
) => {
  const valid = validateMoveLineItemInput(input)
  if ('errors' in valid) {
    throw new UserInputError('Move line item input invalid', valid.errors)
  }

  const maybeLineItem = await getLineItemWithParentAssociations(valid.value.id)
  if (maybeLineItem === null) {
    throw new UserInputError(`Line item ${valid.value.id} does not exist`)
  }

  const targetPallet = await Pallet.findByPk(valid.value.targetPalletId)
  if (!targetPallet) {
    throw new UserInputError(
      `Pallet ${valid.value.targetPalletId} does not exist`,
    )
  }

  const lineItemPromise = authorizeLineItemMutation(
    valid.value.id,
    maybeLineItem,
    context,
  )

  const lineItem = await lineItemPromise
  if (targetPallet.offerId !== lineItem.offerPallet.offerId) {
    throw new UserInputError(
      `Target pallet ${valid.value.targetPalletId} is not in the same offer`,
    )
  }

  await lineItem.update({ offerPalletId: valid.value.targetPalletId })

  return lineItem.offerPallet.offer
}

// Line item custom resolvers
const proposedReceivingGroup: LineItemResolvers['proposedReceivingGroup'] = async (
  parent,
) => {
  if (!parent.proposedReceivingGroupId) {
    return null
  }

  const receivingGroup = await Group.findByPk(parent.proposedReceivingGroupId)

  if (!receivingGroup) {
    throw new ApolloError('No group exists with that ID')
  }

  return receivingGroup
}

const acceptedReceivingGroup: LineItemResolvers['acceptedReceivingGroup'] = async (
  parent,
) => {
  if (!parent.acceptedReceivingGroupId) {
    return null
  }

  const receivingGroup = await Group.findByPk(parent.acceptedReceivingGroupId)

  if (!receivingGroup) {
    throw new ApolloError('No group exists with that ID')
  }

  return receivingGroup
}

export {
  lineItem,
  addLineItem,
  updateLineItem,
  destroyLineItem,
  moveLineItem,
  proposedReceivingGroup,
  acceptedReceivingGroup,
}
