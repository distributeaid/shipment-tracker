import { useAllRegionsQuery } from '../types/api-types'

export const useRegions = () => {
  const { data } = useAllRegionsQuery({
    fetchPolicy: 'cache-and-network',
  })
  return data?.regions ?? []
}
