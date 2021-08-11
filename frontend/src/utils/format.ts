import { BadgeColor } from '../components/Badge'
import { SelectOption } from '../components/forms/SelectField'
import {
  COUNTRY_CODES_TO_NAME,
  LINE_ITEM_CATEGORY_OPTIONS,
  MONTHS,
  SHIPMENT_STATUS_OPTIONS,
  SHIPPING_ROUTE_OPTIONS,
} from '../data/constants'
import {
  AllGroupsMinimalQuery,
  GroupType,
  LineItem,
  LineItemCategory,
  LineItemContainerType,
  Maybe,
  PalletType,
  Shipment,
  ShipmentQuery,
  ShipmentStatus,
  ShippingRoute,
} from '../types/api-types'

export function formatGroupType(type: GroupType) {
  switch (type) {
    case GroupType.DaHub:
      return 'DA hub'
    case GroupType.ReceivingGroup:
      return 'Receiving group'
    case GroupType.SendingGroup:
      return 'Sending group'
    default:
      throw new Error(`Unknown GroupType: ${type}`)
  }
}

/**
 * Format a month's 1-based number into a string.
 * @param labelMonth a Shipment.labelMonth
 * @example formatLabelMonth(1) // January
 */
export function formatLabelMonth(labelMonth: number) {
  return MONTHS[labelMonth - 1]
}

export function formatCountryCodeToName(countryCode?: Maybe<string>) {
  if (countryCode && COUNTRY_CODES_TO_NAME.hasOwnProperty(countryCode)) {
    return COUNTRY_CODES_TO_NAME[
      countryCode as keyof typeof COUNTRY_CODES_TO_NAME
    ]
  }

  return 'Unknown Country'
}

export function formatLineItemCategory(category: LineItemCategory) {
  const matchingCategory = LINE_ITEM_CATEGORY_OPTIONS.find(
    (c) => c.value === category,
  )
  return matchingCategory?.label || category
}

export function formatPalletType(palletType: PalletType) {
  switch (palletType) {
    case PalletType.Custom:
      return 'Ton bag'
    case PalletType.Euro:
      return 'Euro pallet'
    case PalletType.Standard:
      return 'Standard pallet'
    default:
      throw new Error(`Unknown PalletType: ${palletType}`)
  }
}

/**
 * Returns a BadgeColor based mapped to a ShipmentStatus
 * @param status a ShipmentStatus
 */
export function getShipmentStatusBadgeColor(
  status: ShipmentStatus,
): BadgeColor {
  switch (status) {
    case ShipmentStatus.Announced:
      return 'blue'
    case ShipmentStatus.Open:
      return 'green'
    case ShipmentStatus.Abandoned:
      return 'red'
    default:
      return 'gray'
  }
}

/**
 * Formats a shipment name for quick identification. Note that this is NOT a
 * unique identifier!
 * @param shipment
 * @returns A non-unique identifier for the shipment
 * @example formatShipmentName(shipment) // "UK-FR-2021-03"
 */
export function formatShipmentName(
  shipment:
    | Shipment
    | Pick<
        ShipmentQuery['shipment'],
        'labelMonth' | 'labelYear' | 'shippingRoute'
      >,
) {
  const month = shipment.labelMonth.toString().padStart(2, '0')
  return `${shipment.shippingRoute.toString().replace('_TO_', '-')}-${
    shipment.labelYear
  }-${month}`
}

export function formatShippingRouteName(shippingRoute: ShippingRoute) {
  const matchingRoute = SHIPPING_ROUTE_OPTIONS.find(
    (option) => option.value === shippingRoute,
  )
  return matchingRoute?.label || 'Unknown route'
}

export function formatShipmentStatus(shipmentStatus: ShipmentStatus) {
  const matchingStatus = SHIPMENT_STATUS_OPTIONS.find(
    (option) => option.value === shipmentStatus,
  )
  return matchingStatus?.label || shipmentStatus
}

export function formatContainerType(
  type: LineItemContainerType,
  count: number,
) {
  return {
    [LineItemContainerType.Box]: count === 1 ? '1 box' : `${count} boxes`,
    [LineItemContainerType.BulkBag]:
      count === 1 ? '1 bulk bag' : `${count} bulk bags`,
    [LineItemContainerType.FullPallet]: 'The full pallet',
    [LineItemContainerType.Unset]: 'Not set',
  }[type]
}

export function getLineItemVolumeInSquareMeters(
  lineItem: Pick<
    LineItem,
    'containerWidthCm' | 'containerHeightCm' | 'containerLengthCm'
  >,
) {
  const {
    containerWidthCm = 0,
    containerLengthCm = 0,
    containerHeightCm = 0,
  } = lineItem

  return (
    (
      (containerHeightCm! * containerLengthCm! * containerWidthCm!) /
      1000000
    ).toFixed(2) + 'm³'
  )
}

export function getContainerCountLabel(containerType: LineItemContainerType) {
  return {
    [LineItemContainerType.Unset]: 'Amount of containers',
    [LineItemContainerType.Box]: 'Amount of boxes',
    [LineItemContainerType.BulkBag]: 'Amount of bags',
    [LineItemContainerType.FullPallet]: 'Amount of pallets',
  }[containerType]
}

export const kilosToGrams = (kilos: number) => kilos * 1000

export const gramsToKilos = (grams: number) => grams / 1000

export function groupToSelectOption(
  group: AllGroupsMinimalQuery['listGroups'][0],
): SelectOption {
  return { value: group.id, label: group.name }
}

export const formatListOfHubs = (hubs: { name: string }[]): string =>
  hubs.map(({ name }) => name).join(',')
