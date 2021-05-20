import { BadgeColor } from '../components/Badge'
import { SelectOption } from '../components/forms/SelectField'
import {
  COUNTRY_CODES_TO_NAME,
  LINE_ITEM_CATEGORY_OPTIONS,
  MONTHS,
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
    case ShipmentStatus.Abandoned:
      return 'red'
    case ShipmentStatus.Announced:
      return 'blue'
    case ShipmentStatus.Complete:
      return 'green'
    case ShipmentStatus.InProgress:
      return 'blue'
    case ShipmentStatus.Open:
      return 'yellow'
    case ShipmentStatus.Staging:
    default:
      return 'gray'
  }
}

/**
 * Formats a shipment name for quick identification. Note that this is NOT a
 * unique identifier!
 * @param shipment
 * @returns A non-unique identifier for the shipment
 * @example "UK-2021-03"
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

export function formatContainerType(
  type: LineItemContainerType,
  pluralize?: boolean,
) {
  return {
    [LineItemContainerType.Box]: pluralize ? 'Boxes' : 'Box',
    [LineItemContainerType.BulkBag]: pluralize ? 'Bulk bags' : 'Bulk bag',
    [LineItemContainerType.FullPallet]: pluralize
      ? 'Full pallets'
      : 'Full pallet',
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
