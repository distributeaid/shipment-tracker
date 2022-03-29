import { countries, Country } from './countries'

export type Region = {
  id: string
  country: Country
  locality?: string
}

export const knownRegions = {
  calais: {
    id: 'calais',
    country: countries.GB,
    locality: 'Calais/Dunkirk',
  },
  paris: {
    id: 'paris',
    country: countries.FR,
    locality: 'Paris',
  },
  greece: {
    id: 'greece',
    country: countries.GR,
    locality: undefined,
  },
  chios: {
    id: 'chios',
    country: countries.GR,
    locality: 'Chios',
  },
  samos: {
    id: 'samos',
    country: countries.GR,
    locality: 'Samos',
  },
  lesvos: {
    id: 'lesvos',
    country: countries.GR,
    locality: 'Lesvos',
  },
  northernGreece: {
    id: 'northernGreece',
    country: countries.GR,
    locality: 'Thessaloniki/Northern Mainland',
  },
  southernGreece: {
    id: 'southernGreece',
    country: countries.GR,
    locality: 'Athens/Southern Mainland',
  },
  lybia: {
    id: 'lybia',
    country: countries.LY,
    locality: undefined,
  },
  beirut: {
    id: 'beirut',
    country: countries.LB,
    locality: 'Beirut',
  },
  bekaa: {
    id: 'bekaa',
    country: countries.LB,
    locality: 'Bekaa Valley',
  },
  saida: {
    id: 'saida',
    country: countries.LB,
    locality: 'Saida',
  },
  lebanon: {
    id: 'lebanon',
    country: countries.LB,
  },
  bosnia: {
    id: 'bosnia',
    country: countries.BA,
    locality: undefined,
  },
  serbia: {
    id: 'serbia',
    country: countries.RS,
    locality: undefined,
  },
  ventimiglia: {
    id: 'ventimiglia',
    country: countries.IT,
    locality: 'Ventimiglia',
  },
  romania: {
    id: 'romania',
    country: countries.RO,
    locality: undefined,
  },
  poland: {
    id: 'poland',
    country: countries.PL,
    locality: undefined,
  },
  germany: {
    id: 'germany',
    country: countries.DE,
    locality: undefined,
  },
  uk: {
    id: 'uk',
    country: countries.GB,
    locality: undefined,
  },
} as const
