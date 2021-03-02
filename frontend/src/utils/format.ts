import { GroupType } from '../fixtures/groups'

export function formatGroupType(type: GroupType) {
  switch (type) {
    case GroupType.DAHub:
      return 'DA hub'
    case GroupType.ReceivingGroup:
      return 'Receiving group'
    case GroupType.SendingGroup:
      return 'Sending group'
    default:
      throw new Error(`Unknown GroupType: ${type}`)
  }
}
