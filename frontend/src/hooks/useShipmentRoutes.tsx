import { useAllShipmentRoutesQuery } from '../types/api-types'

export const useShipmentRoutes = () => {
  const { data } = useAllShipmentRoutesQuery({
    fetchPolicy: 'cache-and-network',
  })
  return data?.listShipmentRoutes ?? []
}
