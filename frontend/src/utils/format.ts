import { BadgeColor } from '../components/Badge'
import { GroupType, ShipmentStatus } from '../types/api-types'

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
  return [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ][labelMonth - 1]
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
