import { GroupType } from '../types/api-types'

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
