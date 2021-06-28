import { Type } from '@sinclair/typebox'
import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import { isEqual } from 'lodash'
import Group from '../models/group'
import Shipment, { ShipmentAttributes } from '../models/shipment'
import ShipmentExport from '../models/shipment_export'
import {
  MutationResolvers,
  QueryResolvers,
  ShipmentResolvers,
  ShipmentStatus,
  ShippingRoute,
} from '../server-internal-types'
import { validateIdInput } from './input-validation/idInputSchema'
import {
  CurrentYearOrGreater,
  ID,
  MonthIndexStartingAt1,
  Pricing,
} from './input-validation/types'
import { validateWithJSONSchema } from './input-validation/validateWithJSONSchema'

// Shipment query resolvers

// - list shipments by status

const listShipmentsInput = Type.Object(
  {
    status: Type.Optional(
      Type.Array(Type.Enum(ShipmentStatus), { minItems: 1 }),
    ),
  },
  { additionalProperties: false },
)

const validateListShipmentsInput = validateWithJSONSchema(listShipmentsInput)

const listShipments: QueryResolvers['listShipments'] = async (_, input) => {
  const valid = validateListShipmentsInput(input)
  if ('errors' in valid) {
    throw new UserInputError('List shipments input invalid', valid.errors)
  }

  if (valid.value.status !== undefined) {
    return Shipment.findAll({
      where: {
        status: valid.value.status,
      },
    })
  }

  return Shipment.findAll()
}

// - get shipment

const shipment: QueryResolvers['shipment'] = async (_, { id }) => {
  const valid = validateIdInput({ id })
  if ('errors' in valid) {
    throw new UserInputError('Get shipment input invalid', valid.errors)
  }

  const shipment = await Shipment.findByPk(valid.value.id)

  if (!shipment) {
    throw new ApolloError(`No shipment exists with ID "${valid.value.id}"`)
  }

  return shipment
}

// Shipment mutation resolvers

// - add shipment

const addShipmentInput = Type.Object(
  {
    shippingRoute: Type.Enum(ShippingRoute),
    labelYear: CurrentYearOrGreater(),
    labelMonth: MonthIndexStartingAt1,
    sendingHubId: ID,
    receivingHubId: ID,
    status: Type.Enum(ShipmentStatus),
    pricing: Pricing,
  },
  { additionalProperties: false },
)

const validateAddShipmentsInput = validateWithJSONSchema(addShipmentInput)

const addShipment: MutationResolvers['addShipment'] = async (
  _,
  { input },
  context,
) => {
  const valid = validateAddShipmentsInput(input)
  if ('errors' in valid) {
    throw new UserInputError('Add shipment input invalid', valid.errors)
  }

  const sendingHubPromise = Group.findByPk(valid.value.sendingHubId, {
    include: [{ association: 'captain' }],
  })
  const receivingHubPromise = Group.findByPk(valid.value.receivingHubId, {
    include: [{ association: 'captain' }],
  })

  const sendingHub = await sendingHubPromise
  if (!sendingHub) {
    throw new ApolloError('Sending hub not found')
  }

  const receivingHub = await receivingHubPromise
  if (!receivingHub) {
    throw new ApolloError('Receiving hub not found')
  }

  const creatorIsGroupCaptain = [
    receivingHub.captain.id,
    sendingHub.captain.id,
  ].includes(context.auth.userAccount.id)

  if (creatorIsGroupCaptain && valid.value.status === ShipmentStatus.Open) {
    // Pass: Group captains can create OPEN shipments
  } else if (!context.auth.isAdmin) {
    throw new ForbiddenError('addShipment forbidden to non-admin users')
  }

  const shipmentDate = new Date(
    valid.value.labelYear,
    valid.value.labelMonth - 1,
  )
  if (shipmentDate < new Date()) {
    throw new UserInputError(
      `The shipment date "${shipmentDate.toISOString()}" cannot be in the past`,
    )
  }

  return Shipment.create({
    shippingRoute: valid.value.shippingRoute,
    labelYear: valid.value.labelYear,
    labelMonth: valid.value.labelMonth,
    sendingHubId: valid.value.sendingHubId,
    receivingHubId: valid.value.receivingHubId,
    status: valid.value.status,
    statusChangeTime: new Date(),
    pricing: valid.value.pricing,
  })
}

// - update shipment

const updateShipmentInput = Type.Object(
  {
    id: ID,
    input: Type.Object(
      {
        status: Type.Optional(Type.Enum(ShipmentStatus)),
        sendingHubId: Type.Optional(ID),
        receivingHubId: Type.Optional(ID),
        labelYear: Type.Optional(CurrentYearOrGreater()),
        labelMonth: Type.Optional(MonthIndexStartingAt1),
        shippingRoute: Type.Optional(Type.Enum(ShippingRoute)),
        pricing: Type.Optional(Pricing),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
)

const validateUpdateShipmentInput = validateWithJSONSchema(updateShipmentInput)

const updateShipment: MutationResolvers['updateShipment'] = async (
  _,
  input,
  context,
) => {
  const valid = validateUpdateShipmentInput(input)
  if ('errors' in valid) {
    throw new UserInputError('Update line item arguments invalid', valid.errors)
  }

  if (!context.auth.isAdmin) {
    throw new ForbiddenError('updateShipment forbidden to non-admin users')
  }

  const shipment = await Shipment.findByPk(valid.value.id)

  if (shipment === null) {
    throw new ApolloError(`No shipment exists with ID "${valid.value.id}"`)
  }

  const {
    status,
    receivingHubId,
    sendingHubId,
    labelMonth,
    labelYear,
    shippingRoute,
    pricing,
  } = valid.value.input

  const updateAttributes: Partial<ShipmentAttributes> = {}

  if (status !== undefined) {
    updateAttributes.status = status
    updateAttributes.statusChangeTime = new Date()
  }

  if (receivingHubId !== undefined) {
    const receivingHub = await Group.findByPk(receivingHubId)
    if (receivingHub === null) {
      throw new ApolloError(
        `No receiving group exists with ID "${receivingHubId}"`,
      )
    }

    updateAttributes.receivingHubId = receivingHubId
  }

  if (sendingHubId) {
    const sendingHub = await Group.findByPk(sendingHubId)
    if (sendingHub === null) {
      throw new ApolloError(`No sending group exists with ID "${sendingHubId}"`)
    }

    updateAttributes.sendingHubId = sendingHubId
  }

  if (labelMonth !== undefined) {
    updateAttributes.labelMonth = labelMonth
  }

  if (labelYear !== undefined) {
    updateAttributes.labelYear = labelYear
  }

  const shipmentDate = new Date(
    labelYear ?? shipment.labelYear,
    (labelMonth ?? shipment.labelMonth) - 1,
  )
  if (shipmentDate < new Date()) {
    throw new UserInputError(
      `The shipment date "${shipmentDate.toISOString()}" cannot be in the past`,
    )
  }

  if (shippingRoute !== undefined) {
    updateAttributes.shippingRoute = shippingRoute
  }

  if (pricing !== undefined && !isEqual(pricing, shipment.pricing)) {
    updateAttributes.pricing = pricing
  }

  return shipment.update(updateAttributes)
}

// Shipment custom resolvers
const sendingHub: ShipmentResolvers['sendingHub'] = async (parent) => {
  const sendingHub = await Group.findByPk(parent.sendingHubId)

  if (!sendingHub) {
    throw new ApolloError(
      `No sending group exists with ID "${parent.sendingHubId}"`,
    )
  }

  return sendingHub
}

const receivingHub: ShipmentResolvers['receivingHub'] = async (parent) => {
  const receivingHub = await Group.findByPk(parent.receivingHubId)

  if (!receivingHub) {
    throw new ApolloError(
      `No receiving group exists with ID "${parent.receivingHubId}"`,
    )
  }

  return receivingHub
}

const shipmentExports: ShipmentResolvers['exports'] = async (
  parent,
  _,
  { auth: isAdmin },
) => {
  if (!isAdmin) {
    throw new ForbiddenError('Must be admin to query shipment exports')
  }

  return ShipmentExport.findAll({
    where: { shipmentId: parent.id },
  }).then((shipmentExports) =>
    shipmentExports.map((shipmentExport) => shipmentExport.toWireFormat()),
  )
}

export {
  listShipments,
  shipment,
  addShipment,
  updateShipment,
  sendingHub,
  receivingHub,
  shipmentExports,
}
