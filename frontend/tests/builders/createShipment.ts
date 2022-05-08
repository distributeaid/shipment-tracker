import { GroupType, Shipment, ShipmentStatus } from '../../src/types/api-types'

export const createShipment = ({ id }: { id: number }): Shipment => ({
  id,
  origin: {
    id: 'uk',
    country: {
      countryCode: 'GB',
      shortName: 'United Kingdom of Great Britain and Northern Ireland (the)',
      alias: 'UK',
    },
    locality: 'All regions',
  },
  destination: {
    id: 'calais',
    country: {
      countryCode: 'FR',
      shortName: 'France',
      alias: null,
    },
    locality: 'Calais/Dunkirk',
  },
  labelYear: 2022,
  labelMonth: 6,
  offerSubmissionDeadline: null,
  status: ShipmentStatus.Open,
  createdAt: '2022-03-16T07:56:23.076Z',
  updatedAt: '2022-03-16T07:56:23.076Z',
  statusChangeTime: '2022-03-16T07:56:23.076Z',
  receivingHubs: [
    {
      id: 22,
      name: 'Sending Hub b950312b-f335-4cb1-96b1-2464e36bfefe',
      locality: 'Coventry',
      country: {
        countryCode: 'GB',
        shortName: 'United Kingdom of Great Britain and Northern Ireland (the)',
        alias: 'UK',
      },
      createdAt: '2022-03-16T07:56:23.076Z',
      updatedAt: '2022-03-16T07:56:23.076Z',
      captainId: 1,
      groupType: GroupType.DaHub,
      primaryContact: {
        name: 'Alex Doe',
      },
      servingRegions: [],
    },
  ],
  sendingHubs: [
    {
      id: 23,
      name: 'Receiving Hub e8829ff3-5f60-4244-8fa8-a7ea3b6abd8b',
      locality: 'Calais',
      country: {
        countryCode: 'FR',
        shortName: 'France',
      },
      createdAt: '2022-03-16T07:56:23.076Z',
      updatedAt: '2022-03-16T07:56:23.076Z',
      captainId: 1,
      groupType: GroupType.DaHub,
      primaryContact: {
        name: 'Alex Doe',
      },
      servingRegions: [],
    },
  ],
  receivingGroups: [
    {
      id: 5,
      name: "Justin Victor Gibbs's group",
      locality: 'Trondheim',
      country: {
        countryCode: 'NO',
        shortName: 'Norway',
      },
      createdAt: '2022-03-16T07:56:23.076Z',
      updatedAt: '2022-03-16T07:56:23.076Z',
      captainId: 1,
      groupType: GroupType.Regular,
      primaryContact: {
        name: 'Alex Doe',
      },
      servingRegions: [],
    },
    {
      id: 6,
      name: "Bertha Ethel Graham's group",
      locality: 'Trondheim',
      country: {
        countryCode: 'NO',
        shortName: 'Norway',
      },
      createdAt: '2022-03-16T07:56:23.076Z',
      updatedAt: '2022-03-16T07:56:23.076Z',
      captainId: 1,
      groupType: GroupType.Regular,
      primaryContact: {
        name: 'Alex Doe',
      },
      servingRegions: [],
    },
    {
      id: 7,
      name: "Ruth Louisa Kim's group",
      locality: 'Trondheim',
      country: {
        countryCode: 'NO',
        shortName: 'Norway',
      },
      createdAt: '2022-03-16T07:56:23.076Z',
      updatedAt: '2022-03-16T07:56:23.076Z',
      captainId: 1,
      groupType: GroupType.Regular,
      primaryContact: {
        name: 'Alex Doe',
      },
      servingRegions: [],
    },
  ],
})
