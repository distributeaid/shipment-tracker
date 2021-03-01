export enum GroupType {
  DAHub = 'DA_HUB',
  ReceivingGroup = 'RECEIVING_GROUP',
  SendingGroup = 'SENDING_GROUP',
}

export type GroupLocation = {
  countryCode?: string
  townCity: string
  openLocationCode?: string
}

export type Group = {
  id: number
  name: string
  groupType: GroupType
  primaryLocation: GroupLocation
  primaryContactName: string
  website?: string
}
