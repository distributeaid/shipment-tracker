import { useAllCountriesQuery } from '../types/api-types'

export const useCountries = () => {
  const { data } = useAllCountriesQuery({
    fetchPolicy: 'cache-and-network',
  })
  return data?.listCountries ?? []
}
