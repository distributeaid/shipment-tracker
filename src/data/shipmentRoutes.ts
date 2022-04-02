import { countries, Country } from './countries'
import { knownRegions, Region } from './regions'

export type ShipmentRoute = {
  id: string
  origin: Region
  servingRegions: Readonly<Region[]>
}

const filterRegionsByCountry = (country: Country): Region[] =>
  Object.values(knownRegions).filter(
    ({ country: regionCountry }) =>
      regionCountry.countryCode === country.countryCode,
  )

export const shipmentRoutes = {
  DeToBa: {
    id: 'DeToBa',
    origin: knownRegions.germany,
    servingRegions: filterRegionsByCountry(countries.BA),
  } as ShipmentRoute,
  DeToRs: {
    id: 'DeToRs',
    origin: knownRegions.germany,
    servingRegions: filterRegionsByCountry(countries.RS),
  } as ShipmentRoute,
  DeToFr: {
    id: 'DeToFr',
    origin: knownRegions.germany,
    servingRegions: filterRegionsByCountry(countries.FR),
  } as ShipmentRoute,
  DeToGr: {
    id: 'DeToGr',
    origin: knownRegions.germany,
    servingRegions: filterRegionsByCountry(countries.GR),
  } as ShipmentRoute,
  DeToLb: {
    id: 'DeToLb',
    origin: knownRegions.germany,
    servingRegions: filterRegionsByCountry(countries.LB),
  } as ShipmentRoute,
  UkToBa: {
    id: 'UkToBa',
    origin: knownRegions.uk,
    servingRegions: filterRegionsByCountry(countries.BA),
  } as ShipmentRoute,
  UkToRs: {
    id: 'UkToRs',
    origin: knownRegions.uk,
    servingRegions: filterRegionsByCountry(countries.RS),
  } as ShipmentRoute,
  UkToFr: {
    id: 'UkToFr',
    origin: knownRegions.uk,
    servingRegions: filterRegionsByCountry(countries.FR),
  } as ShipmentRoute,
  UkToGr: {
    id: 'UkToGr',
    origin: knownRegions.uk,
    servingRegions: filterRegionsByCountry(countries.GR),
  } as ShipmentRoute,
  UkToLb: {
    id: 'UkToLb',
    origin: knownRegions.uk,
    servingRegions: filterRegionsByCountry(countries.LB),
  } as ShipmentRoute,
} as const
