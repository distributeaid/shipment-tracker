import { countries, Country } from './countries'

export type Region = {
  id: string
  country: Country
  locality: string
}

export const knownRegions = {
  calais: {
    id: 'calais',
    country: countries.FR,
    locality: 'Calais/Dunkirk',
  } as Region,
  paris: {
    id: 'paris',
    country: countries.FR,
    locality: 'Paris',
  } as Region,
  greece: {
    id: 'greece',
    country: countries.GR,
    locality: 'Other regions',
  } as Region,
  chios: {
    id: 'chios',
    country: countries.GR,
    locality: 'Chios',
  } as Region,
  samos: {
    id: 'samos',
    country: countries.GR,
    locality: 'Samos',
  } as Region,
  lesvos: {
    id: 'lesvos',
    country: countries.GR,
    locality: 'Lesvos',
  } as Region,
  northernGreece: {
    id: 'northernGreece',
    country: countries.GR,
    locality: 'Thessaloniki/Northern Mainland',
  } as Region,
  southernGreece: {
    id: 'southernGreece',
    country: countries.GR,
    locality: 'Athens/Southern Mainland',
  } as Region,
  lybia: {
    id: 'lybia',
    country: countries.LY,
    locality: 'All regions',
  } as Region,
  beirut: {
    id: 'beirut',
    country: countries.LB,
    locality: 'Beirut',
  } as Region,
  bekaa: {
    id: 'bekaa',
    country: countries.LB,
    locality: 'Bekaa Valley',
  } as Region,
  saida: {
    id: 'saida',
    country: countries.LB,
    locality: 'Saida',
  } as Region,
  lebanon: {
    id: 'lebanon',
    country: countries.LB,
    locality: 'Other regions',
  } as Region,
  bosnia: {
    id: 'bosnia',
    country: countries.BA,
    locality: 'All regions',
  } as Region,
  serbia: {
    id: 'serbia',
    country: countries.RS,
    locality: 'All regions',
  } as Region,
  ventimiglia: {
    id: 'ventimiglia',
    country: countries.IT,
    locality: 'Ventimiglia',
  } as Region,
  romania: {
    id: 'romania',
    country: countries.RO,
    locality: 'All regions',
  } as Region,
  poland: {
    id: 'poland',
    country: countries.PL,
    locality: 'All regions',
  } as Region,
  germany: {
    id: 'germany',
    country: countries.DE,
    locality: 'All regions',
  } as Region,
  uk: {
    id: 'uk',
    country: countries.GB,
    locality: 'All regions',
  } as Region,
} as const
