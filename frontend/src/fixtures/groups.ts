import { Group, GroupType } from '../types/group'

/**
 * A list of groups used for mockups and testing.
 */
const GROUPS: Group[] = [
  {
    id: 1,
    name: "L'Auberge des Migrants",
    groupType: GroupType.ReceivingGroup,
    primaryLocation: {
      countryCode: 'FR',
      townCity: 'Calais',
    },
    primaryContactName: 'Myriam McLaughlin',
  },
  {
    id: 2,
    name: "Refugee Women's Center",
    groupType: GroupType.ReceivingGroup,
    primaryLocation: {
      countryCode: 'FR',
      townCity: 'Dunkerque',
    },
    primaryContactName: 'Meaghan Crist',
  },
  {
    id: 3,
    name: 'Refugee Community Kitchen',
    groupType: GroupType.ReceivingGroup,
    primaryLocation: {
      countryCode: 'GB',
      townCity: 'London',
    },
    primaryContactName: 'Jacinthe Donnelly',
  },
  {
    id: 4,
    name: 'Calais Food Collective',
    groupType: GroupType.ReceivingGroup,
    primaryLocation: {
      countryCode: 'FR',
      townCity: 'Calais',
    },
    primaryContactName: 'Wyman Krajcik',
  },
  {
    id: 7,
    name: 'Distribute Aid - Leeds',
    groupType: GroupType.DAHub,
    primaryLocation: {
      countryCode: 'GB',
      townCity: 'Leeds',
    },
    primaryContactName: 'Elissa Schaefer',
  },
  {
    id: 8,
    name: 'Dumfries - Scotland',
    groupType: GroupType.SendingGroup,
    primaryLocation: {
      countryCode: 'GB',
      townCity: 'Dumfries',
    },
    primaryContactName: 'Nellie Roob',
  },
]

export default GROUPS
