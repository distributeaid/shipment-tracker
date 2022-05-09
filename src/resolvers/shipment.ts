import { Type } from '@sinclair/typebox'
import { ApolloError, ForbiddenError, UserInputError } from 'apollo-server'
import { isEqual, xor } from 'lodash'
import { knownRegions, Region } from '../data/regions'
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
import ShipmentReceivingGroup from '../models/shipment_receiving_group'
import ShipmentReceivingHub from '../models/shipment_receiving_hub'
import ShipmentSendingHub from '../models/shipment_sending_hub'
import {
  GroupType,
  MutationResolvers,
  QueryResolvers,
  ResolversTypes,
  ShipmentResolvers,
  ShipmentStatus,
} from '../server-internal-types'
import { dbToGraphQL as dbGroupToGraphQL } from './group'
import { dbToGraphQL as dbShipmentExportToGraphQL } from './shipment_exports'

const arraysOverlap = (a: unknown[], b: unknown[]): boolean =>
  xor(a, b).length === 0

const SHIPMENT_STATUSES_ALLOWED_FOR_NON_ADMINS: Readonly<ShipmentStatus[]> = [
  ShipmentStatus.Announced,
  ShipmentStatus.Open,
  ShipmentStatus.Staging,
] as const

const dbToGraphQL = (shipment: Shipment): ResolversTypes['Shipment'] => ({
  ...shipment.get({ plain: true }),
  createdAt: shipment.createdAt,
  updatedAt: shipment.updatedAt,
  origin: knownRegions[shipment.origin],
  destination: knownRegions[shipment.destination],
  // Handled in custom resolvers
  receivingHubs: [],
  sendingHubs: [],
  receivingGroups: [],
})

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

  if (status !== undefined) {
    if (!context.auth.isAdmin) {
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
    return (
      await Shipment.findAll({
        where: {
          status,
        },
      })
    ).map(dbToGraphQL)
  } else {
    if (!context.auth.isAdmin) {
      return (
        await Shipment.findAll({
          where: {
            status: SHIPMENT_STATUSES_ALLOWED_FOR_NON_ADMINS,
          },
        })
      ).map(dbToGraphQL)
    } else {
      return (await Shipment.findAll({})).map(dbToGraphQL)
    }
  }
}

// - get shipment

const shipment: QueryResolvers['shipment'] = async (_, { id }, context) => {
  const valid = validateIdInput({ id })
  if ('errors' in valid) {
    throw new UserInputError('Get shipment input invalid', valid.errors)
  }

  const shipment = await Shipment.findByPk(valid.value.id, {})

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

  return dbToGraphQL(shipment)
}

// Shipment mutation resolvers

// - add shipment

const regionIdInput = Type.Union(
  Object.keys(knownRegions).map((id) => Type.Literal(id)),
  { title: 'region ID' },
)

const addShipmentInput = Type.Object(
  {
    origin: regionIdInput,
    destination: regionIdInput,
    labelYear: CurrentYearOrGreater(),
    labelMonth: MonthIndexStartingAt1,
    sendingHubs: Type.Array(ID, { minItems: 1 }),
    receivingHubs: Type.Array(ID, { minItems: 1 }),
    receivingGroups: Type.Array(ID, { minItems: 1 }),
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

  if (
    arraysOverlap(valid.value.receivingGroups, valid.value.receivingHubs) ||
    arraysOverlap(valid.value.receivingGroups, valid.value.sendingHubs)
  ) {
    throw new UserInputError(
      'Add shipment input invalid: receiving group must not be a sending or receiving hub',
      {
        sendingHubs: valid.value.sendingHubs,
        receivingHubs: valid.value.receivingHubs,
        receivingGroups: valid.value.receivingGroups,
      },
    )
  }

  if (!context.auth.isAdmin) {
    throw new ForbiddenError('addShipment forbidden to non-admin users')
  }

  const sendingHubPromise = Group.findAll({
    where: {
      id: valid.value.sendingHubs,
      groupType: GroupType.DaHub,
    },
  })
  const receivingHubPromise = Group.findAll({
    where: {
      id: valid.value.receivingHubs,
      groupType: GroupType.DaHub,
    },
  })
  const receivingGroupsPromise = Group.findAll({
    where: {
      id: valid.value.receivingGroups,
      groupType: GroupType.Regular,
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

  const receivingGroups = await receivingGroupsPromise
  if (receivingGroups.length !== valid.value.receivingGroups.length) {
    const foundGroups = receivingGroups.map(({ id }) => id)
    throw new ApolloError(
      `Could not find receiving group: ${valid.value.receivingGroups.filter(
        (id) => !foundGroups.includes(id),
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

  const origin: Region | undefined =
    knownRegions[valid.value.origin as keyof typeof knownRegions]
  if (origin === undefined)
    throw new UserInputError(`Unknown region: ${valid.value.origin}`)
  const destination: Region | undefined =
    knownRegions[valid.value.destination as keyof typeof knownRegions]
  if (destination === undefined)
    throw new UserInputError(`Unknown region: ${valid.value.destination}`)

  const shipment = await Shipment.create({
    origin: origin.id as keyof typeof knownRegions,
    destination: destination.id as keyof typeof knownRegions,
    labelYear: valid.value.labelYear,
    labelMonth: valid.value.labelMonth,
    sendingHubs: sendingHubs,
    receivingHubs: receivingHubs,
    receivingGroups: receivingGroups,
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
    Promise.all(
      receivingGroups.map((group) =>
        ShipmentReceivingGroup.create({
          groupId: group.id,
          shipmentId: shipment.id,
        }),
      ),
    ),
  ])

  return dbToGraphQL(
    (await Shipment.findByPk(shipment.id, {
      include: [
        {
          association: 'sendingHubs',
        },
        {
          association: 'receivingHubs',
        },
        {
          association: 'receivingGroups',
        },
      ],
    })) as Shipment,
  )
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
        receivingGroups: Type.Optional(Type.Array(ID, { minItems: 1 })),
        labelYear: Type.Optional(CurrentYearOrGreater()),
        labelMonth: Type.Optional(MonthIndexStartingAt1),
        origin: Type.Optional(regionIdInput),
        destination: Type.Optional(regionIdInput),
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

  const shipment = await Shipment.findByPk(valid.value.id, {
    include: [
      { association: 'sendingHubs' },
      { association: 'receivingHubs' },
      { association: 'receivingGroups' },
    ],
  })

  if (shipment === null) {
    throw new ApolloError(`No shipment exists with ID "${valid.value.id}"`)
  }

  const {
    status,
    receivingHubs: receivingHubsUpdate,
    sendingHubs: sendingHubsUpdate,
    receivingGroups: receivingGroupsUpdate,
    labelMonth,
    labelYear,
    origin,
    destination,
    pricing,
  } = valid.value.input

  const updateAttributes: Partial<ShipmentAttributes> = {}

  if (status !== undefined) {
    updateAttributes.status = status
    updateAttributes.statusChangeTime = new Date()
  }

  if (receivingHubsUpdate !== undefined) {
    const loadedReceivingHubs = await Group.findAll({
      where: { id: receivingHubsUpdate, groupType: GroupType.DaHub },
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
      where: { id: sendingHubsUpdate, groupType: GroupType.DaHub },
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

  if (receivingGroupsUpdate !== undefined) {
    const loadedReceivingGroups = await Group.findAll({
      where: { id: receivingGroupsUpdate, groupType: GroupType.Regular },
    })

    if (loadedReceivingGroups.length !== receivingGroupsUpdate.length) {
      const foundHubs = loadedReceivingGroups.map(({ id }) => id)
      throw new ApolloError(
        `Could not find receiving groups: ${receivingGroupsUpdate
          .filter((id) => !foundHubs.includes(id))
          .join(', ')}`,
      )
    }
    updateAttributes.receivingGroups = loadedReceivingGroups
  }

  const newSendingHubs = (
    updateAttributes.sendingHubs ?? shipment.sendingHubs
  ).map(({ id }) => id)
  const newReceivingHubs = (
    updateAttributes.receivingHubs ?? shipment.receivingHubs
  ).map(({ id }) => id)
  const newReceivingGroups = (
    updateAttributes.receivingGroups ?? shipment.receivingGroups
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
  if (
    arraysOverlap(newReceivingGroups, newReceivingHubs) ||
    arraysOverlap(newReceivingGroups, newSendingHubs)
  ) {
    throw new UserInputError(
      'Add shipment input invalid: receiving group must not be a sending or receiving hub',
      {
        sendingHubs: newSendingHubs,
        receivingHubs: newReceivingHubs,
        receivingGroups: newReceivingGroups,
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

  if (origin !== undefined) {
    updateAttributes.origin = knownRegions[origin as keyof typeof knownRegions]
      .id as keyof typeof knownRegions
    if (updateAttributes.origin === undefined)
      throw new UserInputError(`Unknown region: ${origin}`)
  }

  if (destination !== undefined) {
    updateAttributes.destination = knownRegions[
      destination as keyof typeof knownRegions
    ].id as keyof typeof knownRegions
    if (updateAttributes.destination === undefined)
      throw new UserInputError(`Unknown region: ${destination}`)
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

  // Did receiving groups change?
  if (updateAttributes.receivingGroups !== undefined) {
    // Find IDs of receiving groups to delete
    const oldReceivingGroupIds = shipment.receivingGroups.map(({ id }) => id)
    const receivingGroupsToDelete = oldReceivingGroupIds.filter(
      (id) => !receivingGroupsUpdate?.includes(id) ?? false,
    )
    // Find IDs of receiving groups to add
    const receivingGroupsToAdd =
      receivingGroupsUpdate?.filter(
        (id) => !oldReceivingGroupIds.includes(id),
      ) ?? []
    // Execute
    await Promise.all([
      ShipmentReceivingGroup.destroy({
        where: {
          shipmentId: shipment.id,
          groupId: receivingGroupsToDelete,
        },
      }),
      Promise.all(
        receivingGroupsToAdd.map((groupId) =>
          ShipmentReceivingGroup.create({
            shipmentId: shipment.id,
            groupId,
          }),
        ),
      ),
    ])
  }

  return dbToGraphQL(await shipment.update(updateAttributes))
}

// Shipment custom resolvers
const sendingHubs: ShipmentResolvers['sendingHubs'] = async (parent) => {
  const sendingHubs = await ShipmentSendingHub.findAll({
    where: {
      shipmentId: parent.id,
    },
    include: [
      {
        association: 'hub',
      },
    ],
  })
  return sendingHubs.map(({ hub }) => dbGroupToGraphQL(hub))
}

const receivingHubs: ShipmentResolvers['receivingHubs'] = async (parent) => {
  const receivingHubs = await ShipmentReceivingHub.findAll({
    where: {
      shipmentId: parent.id,
    },
    include: [
      {
        association: 'hub',
      },
    ],
  })
  return receivingHubs.map(({ hub }) => dbGroupToGraphQL(hub))
}

const receivingGroups: ShipmentResolvers['receivingGroups'] = async (
  parent,
) => {
  const receivingGroups = await ShipmentReceivingGroup.findAll({
    where: {
      shipmentId: parent.id,
    },
    include: [
      {
        association: 'group',
      },
    ],
  })
  return receivingGroups.map(({ group }) => dbGroupToGraphQL(group))
}

const shipmentExports: ShipmentResolvers['exports'] = async (
  parent,
  _,
  { auth: { isAdmin } },
) => {
  if (!isAdmin) {
    throw new ForbiddenError('Must be admin to query shipment exports')
  }

  return (
    await ShipmentExport.findAll({
      where: { shipmentId: parent.id },
      include: [{ association: 'userAccount' }],
    })
  ).map(dbShipmentExportToGraphQL)
}

export {
  listShipments,
  shipment,
  addShipment,
  updateShipment,
  sendingHubs,
  receivingHubs,
  receivingGroups,
  shipmentExports,
}
