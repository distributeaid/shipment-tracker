import { Type } from '@sinclair/typebox'
import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import { isEqual, xor } from 'lodash'
import { ShipmentRoutes, wireFormatShipmentRoute } from '../data/shipmentRoutes'
import { validateIdInput } from '../input-validation/idInputSchema'
import {
  CurrentYearOrGreater,
  ID,
  MonthIndexStartingAt1,
  Pricing,
} from '../input-validation/types'
import { validateWithJSONSchema } from '../input-validation/validateWithJSONSchema'
import Group from '../models/group'
import Shipment, { ShipmentAttributes } from '../models/shipment'
import ShipmentExport from '../models/shipment_export'
import ShipmentReceivingHub from '../models/shipment_receiving_hub'
import ShipmentSendingHub from '../models/shipment_sending_hub'
import UserAccount from '../models/user_account'
import {
  MutationResolvers,
  QueryResolvers,
  ShipmentResolvers,
  ShipmentRoute,
  ShipmentStatus,
} from '../server-internal-types'

const arraysOverlap = (a: unknown[], b: unknown[]): boolean =>
  xor(a, b).length === 0

const SHIPMENT_STATUSES_ALLOWED_FOR_NON_ADMINS: Readonly<ShipmentStatus[]> = [
  ShipmentStatus.Announced,
  ShipmentStatus.Open,
  ShipmentStatus.Staging,
] as const

const include = [
  {
    model: Group,
    as: 'sendingHubs',
  },
  {
    model: Group,
    as: 'receivingHubs',
  },
]

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

const listShipments: QueryResolvers['listShipments'] = async (
  _,
  input,
  context,
) => {
  const valid = validateListShipmentsInput(input)
  if ('errors' in valid) {
    throw new UserInputError('List shipments input invalid', valid.errors)
  }
  const { status } = valid.value

  if (!context.auth.isAdmin && status !== undefined) {
    const forbiddenStatus = status.filter(
      (s) => !SHIPMENT_STATUSES_ALLOWED_FOR_NON_ADMINS.includes(s),
    )
    if (forbiddenStatus.length > 0)
      throw new ForbiddenError(
        `non-admin users are not allowed to view shipments with status ${forbiddenStatus.join(
          ', ',
        )}`,
      )
  }

  let shipments: Shipment[] = []

  if (status !== undefined) {
    shipments = await Shipment.findAll({
      where: {
        status,
      },
      include,
    })
  }

  if (!context.auth.isAdmin)
    shipments = await Shipment.findAll({
      where: {
        status: SHIPMENT_STATUSES_ALLOWED_FOR_NON_ADMINS,
      },
      include,
    })

  shipments = await Shipment.findAll({
    include,
  })

  return shipments.map((shipment) => shipment.toWireFormat())
}

// - get shipment

const shipment: QueryResolvers['shipment'] = async (_, { id }, context) => {
  const valid = validateIdInput({ id })
  if ('errors' in valid) {
    throw new UserInputError('Get shipment input invalid', valid.errors)
  }

  const shipment = await Shipment.findByPk(valid.value.id, {
    include,
  })

  if (!shipment) {
    throw new ApolloError(`No shipment exists with ID "${valid.value.id}"`)
  }

  if (
    !context.auth.isAdmin &&
    !SHIPMENT_STATUSES_ALLOWED_FOR_NON_ADMINS.includes(shipment.status)
  ) {
    throw new ForbiddenError(
      `non-admin users are not allowed to view shipments with status ${shipment.status}`,
    )
  }

  return shipment.toWireFormat()
}

// Shipment mutation resolvers

// - add shipment

const addShipmentInput = Type.Object(
  {
    shipmentRoute: Type.Union(ShipmentRoutes.map(({ id }) => Type.Literal(id))),
    labelYear: CurrentYearOrGreater(),
    labelMonth: MonthIndexStartingAt1,
    sendingHubs: Type.Array(ID, { minItems: 1 }),
    receivingHubs: Type.Array(ID, { minItems: 1 }),
    status: Type.Enum(ShipmentStatus),
    pricing: Type.Optional(Pricing),
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

  if (arraysOverlap(valid.value.receivingHubs, valid.value.sendingHubs)) {
    throw new UserInputError(
      'Add shipment input invalid: sending and receiving hubs must be different',
      {
        sendingHubs: valid.value.sendingHubs,
        receivingHubs: valid.value.receivingHubs,
      },
    )
  }

  if (!context.auth.isAdmin) {
    throw new ForbiddenError('addShipment forbidden to non-admin users')
  }

  const sendingHubPromise = Group.findAll({
    where: {
      id: valid.value.sendingHubs,
    },
  })
  const receivingHubPromise = Group.findAll({
    where: {
      id: valid.value.receivingHubs,
    },
  })

  const sendingHubs = await sendingHubPromise
  if (sendingHubs.length !== valid.value.sendingHubs.length) {
    const foundHubs = sendingHubs.map(({ id }) => id)
    throw new ApolloError(
      `Could not find sending hubs: ${valid.value.receivingHubs.filter(
        (id) => !foundHubs.includes(id),
      )}`,
    )
  }

  const receivingHubs = await receivingHubPromise
  if (receivingHubs.length !== valid.value.receivingHubs.length) {
    const foundHubs = receivingHubs.map(({ id }) => id)
    throw new ApolloError(
      `Could not find receiving hubs: ${valid.value.receivingHubs.filter(
        (id) => !foundHubs.includes(id),
      )}`,
    )
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

  let shipmentRoute: ShipmentRoute
  try {
    shipmentRoute = wireFormatShipmentRoute(valid.value.shipmentRoute)
  } catch (err) {
    throw new UserInputError((err as Error).message)
  }

  const shipment = await Shipment.create({
    shipmentRoute: valid.value.shipmentRoute,
    labelYear: valid.value.labelYear,
    labelMonth: valid.value.labelMonth,
    sendingHubs: sendingHubs,
    receivingHubs: receivingHubs,
    status: valid.value.status,
    statusChangeTime: new Date(),
    pricing: valid.value.pricing,
  })
  await Promise.all([
    Promise.all(
      sendingHubs.map((hub) =>
        ShipmentSendingHub.create({
          hubId: hub.id,
          shipmentId: shipment.id,
        }),
      ),
    ),
    Promise.all(
      receivingHubs.map((hub) =>
        ShipmentReceivingHub.create({
          hubId: hub.id,
          shipmentId: shipment.id,
        }),
      ),
    ),
  ])

  return (
    (await Shipment.findByPk(shipment.id, {
      include,
    })) as Shipment
  ).toWireFormat()
}

// - update shipment

const updateShipmentInput = Type.Object(
  {
    id: ID,
    input: Type.Object(
      {
        status: Type.Optional(Type.Enum(ShipmentStatus)),
        sendingHubs: Type.Optional(Type.Array(ID, { minItems: 1 })),
        receivingHubs: Type.Optional(Type.Array(ID, { minItems: 1 })),
        labelYear: Type.Optional(CurrentYearOrGreater()),
        labelMonth: Type.Optional(MonthIndexStartingAt1),
        shipmentRoute: Type.Optional(
          Type.Union(ShipmentRoutes.map(({ id }) => Type.Literal(id))),
        ),
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

  const shipment = await Shipment.findByPk(valid.value.id, { include })

  if (shipment === null) {
    throw new ApolloError(`No shipment exists with ID "${valid.value.id}"`)
  }

  const {
    status,
    receivingHubs: receivingHubsUpdate,
    sendingHubs: sendingHubsUpdate,
    labelMonth,
    labelYear,
    shipmentRoute,
    pricing,
  } = valid.value.input

  const updateAttributes: Partial<ShipmentAttributes> = {}

  if (status !== undefined) {
    updateAttributes.status = status
    updateAttributes.statusChangeTime = new Date()
  }

  if (receivingHubsUpdate !== undefined) {
    const loadedReceivingHubs = await Group.findAll({
      where: { id: receivingHubsUpdate },
    })

    if (loadedReceivingHubs.length !== receivingHubsUpdate.length) {
      const foundHubs = loadedReceivingHubs.map(({ id }) => id)
      throw new ApolloError(
        `Could not find receiving hubs: ${receivingHubsUpdate
          .filter((id) => !foundHubs.includes(id))
          .join(', ')}`,
      )
    }
    updateAttributes.receivingHubs = loadedReceivingHubs
  }

  if (sendingHubsUpdate) {
    const loadedSendingHubs = await Group.findAll({
      where: { id: sendingHubsUpdate },
    })

    if (loadedSendingHubs.length !== sendingHubsUpdate.length) {
      const foundHubs = loadedSendingHubs.map(({ id }) => id)
      throw new ApolloError(
        `Could not find sending hubs: ${sendingHubsUpdate
          .filter((id) => !foundHubs.includes(id))
          .join(', ')}`,
      )
    }

    updateAttributes.sendingHubs = loadedSendingHubs
  }

  const newSendingHubs = (
    updateAttributes.sendingHubs ?? shipment.sendingHubs
  ).map(({ id }) => id)
  const newReceivingHubs = (
    updateAttributes.receivingHubs ?? shipment.receivingHubs
  ).map(({ id }) => id)
  if (arraysOverlap(newSendingHubs, newReceivingHubs)) {
    throw new UserInputError(
      'Update shipment input invalid: Sending and receiving hubs must be different',
      {
        sendingHubs: newSendingHubs,
        receivingHubs: newReceivingHubs,
      },
    )
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

  if (shipmentRoute !== undefined) {
    try {
      const route = wireFormatShipmentRoute(shipmentRoute)
      updateAttributes.shipmentRoute = shipmentRoute
    } catch (err) {
      throw new UserInputError((err as Error).message)
    }
  }

  if (pricing !== undefined && !isEqual(pricing, shipment.pricing)) {
    updateAttributes.pricing = pricing
  }

  // Did sending hubs change?
  if (updateAttributes.sendingHubs !== undefined) {
    // Find IDs of sending hubs to delete
    const oldSendingHubIds = shipment.sendingHubs.map(({ id }) => id)
    const sendingHubsToDelete = oldSendingHubIds.filter(
      (id) => !sendingHubsUpdate?.includes(id) ?? false,
    )
    // Find IDs of sending hubs to add
    const sendingHubsToAdd =
      sendingHubsUpdate?.filter((id) => !oldSendingHubIds.includes(id)) ?? []
    // Execute
    await Promise.all([
      ShipmentSendingHub.destroy({
        where: {
          shipmentId: shipment.id,
          hubId: sendingHubsToDelete,
        },
      }),
      Promise.all(
        sendingHubsToAdd.map((hubId) =>
          ShipmentSendingHub.create({
            shipmentId: shipment.id,
            hubId,
          }),
        ),
      ),
    ])
  }

  // Did receiving hubs change?
  if (updateAttributes.receivingHubs !== undefined) {
    // Find IDs of receiving hubs to delete
    const oldReceivingHubIds = shipment.receivingHubs.map(({ id }) => id)
    const receivingHubsToDelete = oldReceivingHubIds.filter(
      (id) => !receivingHubsUpdate?.includes(id) ?? false,
    )
    // Find IDs of receiving hubs to add
    const receivingHubsToAdd =
      receivingHubsUpdate?.filter((id) => !oldReceivingHubIds.includes(id)) ??
      []
    // Execute
    await Promise.all([
      ShipmentReceivingHub.destroy({
        where: {
          shipmentId: shipment.id,
          hubId: receivingHubsToDelete,
        },
      }),
      Promise.all(
        receivingHubsToAdd.map((hubId) =>
          ShipmentReceivingHub.create({
            shipmentId: shipment.id,
            hubId,
          }),
        ),
      ),
    ])
  }

  await shipment.update(updateAttributes)

  return (
    (await Shipment.findByPk(shipment.id, {
      include,
    })) as Shipment
  ).toWireFormat()
}

// Shipment custom resolvers
const sendingHubs: ShipmentResolvers['sendingHubs'] = async (parent) => {
  const ids = parent.sendingHubs.map(({ id }) => id)
  const sendingHubs = await Group.findAll({
    where: {
      id: ids,
    },
  })

  if (!sendingHubs) {
    throw new ApolloError(`No sending groups exists with IDs "${ids}"`)
  }

  return sendingHubs.map((hub) => hub.toWireFormat())
}

const receivingHubs: ShipmentResolvers['receivingHubs'] = async (parent) => {
  const ids = parent.receivingHubs.map(({ id }) => id)
  const receivingHubs = await Group.findAll({
    where: {
      id: ids,
    },
  })

  if (!receivingHubs) {
    throw new ApolloError(`No receiving group exists with IDs "${ids}"`)
  }

  return receivingHubs.map((hub) => hub.toWireFormat())
}

const shipmentExports: ShipmentResolvers['exports'] = async (
  parent,
  _,
  { auth: { isAdmin } },
) => {
  if (!isAdmin) {
    throw new ForbiddenError('Must be admin to query shipment exports')
  }

  return ShipmentExport.findAll({
    where: { shipmentId: parent.id },
    include: [UserAccount],
  }).then((shipmentExports) =>
    shipmentExports.map((shipmentExport) => shipmentExport.toWireFormat()),
  )
}

export {
  listShipments,
  shipment,
  addShipment,
  updateShipment,
  sendingHubs,
  receivingHubs,
  shipmentExports,
}
