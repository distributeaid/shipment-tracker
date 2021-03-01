import { Group } from '../api-types'
import { GroupType } from '../types/group'

// TODO remove the placeholder fields when the issue below is resolved
// https://github.com/distributeaid/shipment-tracker/issues/45
type GroupPlaceholder = Group & {
  groupType: GroupType
  primaryLocation: {
    countryCode?: string
    townCity: string
  }
  primaryContact: {
    name: string
  }
}

/**
 * A list of groups used for mockups and testing.
 */

const GROUPS: GroupPlaceholder[] = [
  {
    id: 1,
    name: "L'Auberge des Migrants",
    groupType: GroupType.ReceivingGroup,
    primaryLocation: {
      countryCode: 'FR',
      townCity: 'Calais',
    },
    primaryContact: {
      name: 'Myriam McLaughlin',
    },
  },
  {
    id: 2,
    name: "Refugee Women's Center",
    groupType: GroupType.ReceivingGroup,
    primaryLocation: {
      countryCode: 'FR',
      townCity: 'Dunkerque',
    },
    primaryContact: {
      name: 'Meaghan Crist',
    },
  },
  {
    id: 3,
    name: 'Refugee Community Kitchen',
    groupType: GroupType.ReceivingGroup,
    primaryLocation: {
      countryCode: 'GB',
      townCity: 'London',
    },
    primaryContact: {
      name: 'Jacinthe Donnelly',
    },
  },
  {
    id: 4,
    name: 'Calais Food Collective',
    groupType: GroupType.ReceivingGroup,
    primaryLocation: {
      countryCode: 'FR',
      townCity: 'Calais',
    },
    primaryContact: {
      name: 'Wyman Krajcik',
    },
  },
  {
    id: 7,
    name: 'Distribute Aid - Leeds',
    groupType: GroupType.DAHub,
    primaryLocation: {
      countryCode: 'GB',
      townCity: 'Leeds',
    },
    primaryContact: {
      name: 'Elissa Schaefer',
    },
  },
  {
    id: 8,
    name: 'Dumfries - Scotland',
    groupType: GroupType.SendingGroup,
    primaryLocation: {
      countryCode: 'GB',
      townCity: 'Dumfries',
    },
    primaryContact: {
      name: 'Nellie Roob',
    },
  },
]

export default GROUPS
